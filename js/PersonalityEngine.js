/**
 * PETPAL AI — Adaptive Personality Engine
 * Tracks user behavior and evolves the pet's emotional traits over time.
 * Traits are influenced by: feed frequency, play frequency, chat frequency, chore completion.
 */

class PersonalityEngine {
    constructor(game) {
        this.game = game;
        this.data = this._load();
        this._weeklyReset();
    }

    // ── Schema ───────────────────────────────────────────────────────────────

    _defaultData() {
        return {
            behavior: {
                totalFeeds: 0, totalPlays: 0, totalChats: 0, totalChores: 0,
                weekFeeds:  0, weekPlays:  0, weekChats:  0, weekChores:  0,
                weekStart:  Date.now()
            },
            traits: {
                affection:     50,  // High = loving; Low = distant
                energy:        50,  // High = bouncy; Low = subdued
                talkativeness: 50,  // High = chatty; Low = quiet
                mood:          50   // High = happy; Low = sad/needy
            },
            history: []
        };
    }

    // ── Persistence ──────────────────────────────────────────────────────────

    _load() {
        try {
            const raw = localStorage.getItem('petpal_personality_engine');
            if (!raw) return this._freshData();
            const p = JSON.parse(raw);
            // Merge to ensure all keys present (handles schema upgrades)
            const def = this._defaultData();
            return {
                behavior: { ...def.behavior, ...p.behavior },
                traits:   { ...def.traits,   ...p.traits   },
                history:  Array.isArray(p.history) ? p.history : []
            };
        } catch { return this._freshData(); }
    }

    _freshData() {
        const d = this._defaultData();
        const petName = this.game.pet?.name || 'Your pet';
        d.history.push({
            ts:     Date.now(),
            event:  'First Day',
            traits: { ...d.traits },
            note:   `${petName} arrived, a blank slate ready to grow.`,
            icon:   'sparkle'
        });
        return d;
    }

    _save() {
        localStorage.setItem('petpal_personality_engine', JSON.stringify(this.data));
    }

    _weeklyReset() {
        const WEEK = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - this.data.behavior.weekStart > WEEK) {
            const b = this.data.behavior;
            b.weekFeeds = 0; b.weekPlays = 0; b.weekChats = 0; b.weekChores = 0;
            b.weekStart = Date.now();
            this._save();
        }
    }

    // ── Event Recording ──────────────────────────────────────────────────────

    recordAction(type) {
        this._weeklyReset();
        const b = this.data.behavior;

        if      (type === 'feed')  { b.totalFeeds++;  b.weekFeeds++;  }
        else if (type === 'play')  { b.totalPlays++;  b.weekPlays++;  }
        else if (type === 'chat')  { b.totalChats++;  b.weekChats++;  }
        else if (type === 'chore') { b.totalChores++; b.weekChores++; }

        this._evolve(type);
        this._save();
    }

    // ── Trait Evolution ──────────────────────────────────────────────────────

    _evolve(trigger) {
        const b    = this.data.behavior;
        const t    = this.data.traits;
        const prev = { ...t };

        // Clamp weekly rates to their realistic maximums before computing targets.
        // Feeding: 0–14/wk → affection 10–90
        // Playing: 0–14/wk → energy 10–90
        // Chatting: 0–20/wk → talkativeness 15–90
        // Overall care: blend of all → mood 10–90
        const fr = Math.min(14, b.weekFeeds);
        const pr = Math.min(14, b.weekPlays);
        const cr = Math.min(20, b.weekChats);
        const hr = Math.min(10, b.weekChores);

        const tAff  = 10 + (fr / 14) * 80;
        const tEng  = 10 + (pr / 14) * 80;
        const tTalk = 15 + (cr / 20) * 75;
        const tMood = 10 + ((fr + pr + hr * 0.7) / 31.5) * 80;

        // Small smooth step per action so personality drifts gradually.
        const S = 0.10;
        t.affection     = this._step(t.affection,     tAff,  S);
        t.energy        = this._step(t.energy,        tEng,  S);
        t.talkativeness = this._step(t.talkativeness, tTalk, S);
        t.mood          = this._step(t.mood,          tMood, S);

        // Record a history snapshot when any trait shifts meaningfully.
        const delta = Math.abs(t.affection - prev.affection)
                    + Math.abs(t.energy    - prev.energy)
                    + Math.abs(t.talkativeness - prev.talkativeness)
                    + Math.abs(t.mood      - prev.mood);

        if (delta >= 3) this._addHistoryEntry(trigger, prev, { ...t });
    }

    _step(current, target, factor) {
        return Math.max(5, Math.min(95, Math.round(current + (target - current) * factor)));
    }

    // ── History ──────────────────────────────────────────────────────────────

    _addHistoryEntry(trigger, prev, next) {
        const petName = this.game.pet?.name || 'Your pet';
        const changes = [];

        const THRESHOLD = 3;
        const traitDescs = {
            affection:     [next.affection     - prev.affection,     'more affectionate', 'more reserved'],
            energy:        [next.energy        - prev.energy,        'more energetic',    'more subdued'],
            talkativeness: [next.talkativeness - prev.talkativeness, 'more talkative',    'quieter'],
            mood:          [next.mood          - prev.mood,          'happier',           'a little sad']
        };

        for (const [key, [diff, pos, neg]] of Object.entries(traitDescs)) {
            if (Math.abs(diff) >= THRESHOLD) changes.push(diff > 0 ? pos : neg);
        }
        if (!changes.length) return;

        const triggerContext = {
            feed:  'being fed regularly',
            play:  'frequent play sessions',
            chat:  'lots of conversation',
            chore: 'completing chores',
            sleep: 'plenty of rest',
            clean: 'being kept clean',
            vet:   'a vet visit'
        };

        const allPositive = changes.every(c => ['more affectionate','more energetic','more talkative','happier'].includes(c));
        const allNegative = changes.every(c => ['more reserved','more subdued','quieter','a little sad'].includes(c));

        let note;
        if (allPositive) {
            note = `${petName} is blossoming — becoming ${changes.join(' and ')} through ${triggerContext[trigger] || 'daily care'}.`;
        } else if (allNegative) {
            note = `${petName} seems ${changes.join(' and ')} — ${triggerContext[trigger] || 'daily patterns'} are shaping their mood.`;
        } else {
            note = `${petName} became ${changes.join(' and ')} through ${triggerContext[trigger] || 'recent care'}.`;
        }

        const icons = { feed:'feed', play:'play_circle', chat:'message', chore:'check', sleep:'moon', clean:'droplets', vet:'medical_cross' };
        const entry = {
            ts:     Date.now(),
            event:  triggerContext[trigger] || 'daily care',
            traits: next,
            note,
            icon:   icons[trigger] || 'sparkle'
        };

        this.data.history.push(entry);
        if (this.data.history.length > 25) this.data.history.shift();
    }

    // ── Public API ───────────────────────────────────────────────────────────

    getPersonalityContext() {
        const t = this.data.traits;
        const lines = [];

        if      (t.affection >= 70)     lines.push('you feel very affectionate and deeply love your owner');
        else if (t.affection <= 30)     lines.push('you have been feeling a bit distant and reserved lately');

        if      (t.energy >= 70)        lines.push('you are bursting with energy and enthusiasm');
        else if (t.energy <= 30)        lines.push('you have been feeling low-energy and mellow');

        if      (t.talkativeness >= 70) lines.push('you are in a very chatty mood and love sharing your thoughts');
        else if (t.talkativeness <= 30) lines.push('you tend to give brief, gentle replies these days');

        if      (t.mood >= 70)          lines.push('you feel wonderfully cared for and content');
        else if (t.mood <= 30)          lines.push('you have been feeling a little sad and longing for more attention');

        return lines.length
            ? `EVOLVED PERSONALITY (shaped by owner behavior): ${lines.join('; ')}.`
            : '';
    }

    getCurrentTraits()  { return { ...this.data.traits };   }
    getBehaviorStats()  { return { ...this.data.behavior };  }
    getHistory()        { return [...this.data.history].reverse(); } // newest first

    getTraitMeta(key, value) {
        const map = {
            affection:     { low: 'Reserved',  mid: 'Warm',    high: 'Very Affectionate', color: '#ec4899', icon: 'heart' },
            energy:        { low: 'Laid-back', mid: 'Active',  high: 'High Energy',       color: '#f59e0b', icon: 'bolt' },
            talkativeness: { low: 'Quiet',     mid: 'Social',  high: 'Very Talkative',    color: '#06b6d4', icon: 'message' },
            mood:          { low: 'Melancholy', mid: 'Content', high: 'Blissful',          color: '#10b981', icon: 'sparkle' }
        };
        const m   = map[key] || {};
        const lbl = value >= 68 ? m.high : value >= 35 ? m.mid : m.low;
        return { label: lbl, color: m.color, icon: m.icon };
    }

    reset() {
        const d = this._defaultData();
        const petName = this.game.pet?.name || 'Your pet';
        d.history.push({
            ts:     Date.now(),
            event:  'New Beginning',
            traits: { ...d.traits },
            note:   `${petName} started fresh with a blank personality slate.`,
            icon:   'paw'
        });
        this.data = d;
        this._save();
    }
}
