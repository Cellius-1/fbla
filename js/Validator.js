/**
 * PETPAL AI — Validator
 * Single source of truth for all validation rules.
 *
 * Return shape for every method:
 *   { ok: true }                          — proceed, no message needed
 *   { ok: true,  advisory: string }       — proceed, show info toast
 *   { ok: false, message: string, soft? } — block; soft=true → amber toast, soft=false → red toast
 */

class Validator {

    // ── Pet Name ──────────────────────────────────────────────────────────────

    static petName(raw) {
        const name = String(raw ?? '').trim();

        if (!name)
            return { ok: false, message: 'Name cannot be blank.' };

        if (name.length < 2)
            return { ok: false, message: `Name is too short — needs at least 2 characters (got ${name.length}).` };

        if (name.length > 20)
            return { ok: false, message: `Name is too long — ${name.length}/20 characters used. Please shorten it.` };

        if (/\s{2,}/.test(name))
            return { ok: false, message: 'Name cannot contain consecutive spaces.' };

        if (!/^[a-zA-Z0-9 '\-]+$/.test(name))
            return { ok: false, message: "Only letters, numbers, spaces, hyphens ( - ), and apostrophes ( ' ) are allowed." };

        return { ok: true, value: name };
    }

    // Incremental feedback while the user types (looser — don't flag valid partial input)
    static petNameLive(raw) {
        const name = String(raw ?? '');
        if (name.length > 20)
            return { ok: false, message: `${name.length}/20 — too long!` };
        if (name.length > 0 && !/^[a-zA-Z0-9 '\-]*$/.test(name))
            return { ok: false, message: "Special characters not allowed." };
        return { ok: true };
    }

    // ── Coin Transaction ──────────────────────────────────────────────────────

    static coins(current, cost) {
        const have = Math.max(0, Math.floor(Number(current) || 0));
        const need = Math.floor(Number(cost) || 0);

        if (need < 0)
            return { ok: false, message: 'Invalid coin amount.' };
        if (have < need) {
            const short = need - have;
            return {
                ok: false,
                message: `Not enough coins — you are ${short} coins short! (Have ${have}, need ${need}.)`
            };
        }
        return { ok: true };
    }

    // Guarantee coins can never go negative
    static clampCoins(val) {
        return Math.max(0, Math.floor(Number(val) || 0));
    }

    // ── Stat Bounds ───────────────────────────────────────────────────────────

    // Called in Pet.fromJSON to guard against corrupted localStorage data
    static sanitizeStats(obj) {
        const STATS = ['hunger', 'happiness', 'health', 'energy', 'cleanliness'];
        STATS.forEach(key => {
            const n = Number(obj[key]);
            obj[key] = isNaN(n) ? 50 : Math.max(0, Math.min(100, n));
        });

        // Numeric growth fields
        obj.totalXp = Math.max(0, Number(obj.totalXp) || 0);
        obj.level   = Math.max(1, Math.min(GAME_CONFIG?.MAX_LEVEL ?? 10, Math.floor(Number(obj.level) || 1)));

        // Counters must be non-negative integers
        for (const key of ['totalActions','feedCount','playCount','sleepCount','cleanCount','vetCount','happyStreak']) {
            obj[key] = Math.max(0, Math.floor(Number(obj[key]) || 0));
        }

        // Booleans
        obj.isSick = Boolean(obj.isSick);

        // Arrays
        if (!Array.isArray(obj.tricks)) obj.tricks = [];

        return obj;
    }

    // ── Action Feasibility ────────────────────────────────────────────────────

    static action(pet, actionId) {
        if (!pet) return { ok: false, message: 'No active pet.' };

        const n  = pet.name;
        const hp = Math.round(pet.health);
        const hu = Math.round(pet.hunger);
        const en = Math.round(pet.energy);
        const cl = Math.round(pet.cleanliness);
        const ha = Math.round(pet.happiness);

        // ── Critical health gate ──────────────────────────────────────────────
        // When health is 0 the pet cannot do anything but rest or see a vet.
        if (hp <= 0 && actionId !== 'vet' && actionId !== 'sleep') {
            return {
                ok: false,
                message: `${n}'s health has reached 0! Only a vet visit or sleep can help right now.`
            };
        }

        switch (actionId) {

            case 'feed':
                // Hard block — feeding has zero net benefit when all three affected stats are maxed
                if (hu >= 99 && ha >= 99 && hp >= 99)
                    return {
                        ok: false, soft: true,
                        message: `${n} is completely full and in perfect shape — no need to feed right now! Save your 15 coins.`
                    };
                // Soft advisory — not hungry but still benefits happiness/health
                if (hu >= 92)
                    return { ok: true, advisory: `${n} isn't very hungry (${hu}/100) but happily nibbles a small snack!` };
                break;

            case 'play':
                // Hard block — too exhausted
                if (en < 15)
                    return {
                        ok: false,
                        message: `${n} is too exhausted to play! Energy is only ${en}/100 — let them sleep first.`
                    };
                // Hard block — too hungry; playing will drop hunger further and risk sickness
                if (hu < 15)
                    return {
                        ok: false,
                        message: `${n} is too hungry to play safely! Hunger is ${hu}/100 — feed them first or they might get sick.`
                    };
                // Advisory — energy getting low
                if (en < 30)
                    return { ok: true, advisory: `${n} is getting tired (Energy: ${en}/100) — this play session will drain them quickly!` };
                // Advisory — hungry
                if (hu < 30)
                    return { ok: true, advisory: `${n} is pretty hungry (${hu}/100) — playing will make the hunger worse. Consider feeding first!` };
                break;

            case 'sleep':
                // Hard block — energy is full AND health is near-max → sleep has no benefit and costs hunger
                if (en >= 99 && hp >= 95)
                    return {
                        ok: false, soft: true,
                        message: `${n} is already fully rested and healthy! (Energy: ${en}/100) No need to sleep right now.`
                    };
                // Advisory — nearly full energy
                if (en >= 90)
                    return { ok: true, advisory: `${n} is almost fully rested (${en}/100) — a short nap won't do much but the health boost helps!` };
                break;

            case 'clean':
                // Hard block — all cleanliness-dependent stats already capped
                if (cl >= 99 && ha >= 95 && hp >= 95)
                    return {
                        ok: false, soft: true,
                        message: `${n} is already spotless and in great shape! (Cleanliness: ${cl}/100) Skip the bath and save 12 coins.`
                    };
                // Advisory — barely dirty
                if (cl >= 90)
                    return { ok: true, advisory: `${n} is pretty clean already (${cl}/100) — but a little grooming session never hurts!` };
                break;

            case 'vet':
                // Hard block — perfectly healthy, not sick, happiness full
                if (!pet.isSick && hp >= 99 && ha >= 95)
                    return {
                        ok: false, soft: true,
                        message: `${n} is in perfect health and not sick! (Health: ${hp}/100) The vet says no visit needed. Save 35 coins.`
                    };
                // Advisory — healthy but a check-up still boosts health
                if (!pet.isSick && hp >= 82)
                    return { ok: true, advisory: `${n} seems healthy, but a preventive check-up is always a good idea!` };
                break;
        }

        return { ok: true };
    }

    // ── API Key ───────────────────────────────────────────────────────────────

    static apiKey(raw) {
        const key = String(raw ?? '').trim();

        if (!key)
            return { ok: false, message: 'API key cannot be blank.' };
        if (!key.startsWith('sk-ant-'))
            return { ok: false, message: 'Invalid key format — Anthropic keys start with "sk-ant-".' };
        if (key.length < 40)
            return { ok: false, message: `Key looks too short (${key.length} characters). Check that you copied the full key.` };

        return { ok: true, value: key };
    }

    // ── Chat Message ──────────────────────────────────────────────────────────

    static chatMessage(raw) {
        const msg = String(raw ?? '').trim();

        if (!msg)
            return { ok: false, message: 'Type something to send!' };
        if (msg.length > 200)
            return { ok: false, message: `Message is ${msg.length}/200 characters — please shorten it.` };

        return { ok: true, value: msg };
    }
}
