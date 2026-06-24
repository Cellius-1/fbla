/**
 * PETPAL AI - Game
 * Coordinates pet, finances, chores, badges, and game loop.
 */

class Game {
    constructor() {
        this.pet      = null;
        this.storage  = new StorageManager();
        this.isRunning = false;

        // Finances
        this.coins        = GAME_CONFIG.STARTING_COINS;
        this.totalSpent   = 0;
        this.totalEarned  = 0;
        this.spentByCategory = {};  // { food: 0, toys: 0, ... }

        // Chore cooldowns — { choreId: lastCompletedTimestamp }
        this.choreCooldowns = {};
        this.totalChoresDone = 0;

        // Badges already unlocked (array of badge ids)
        this.unlockedBadges = [];

        // Activity log (last 50 entries)
        this.activityLog = [];

        // Tick counter
        this._tickId = null;

        // Adaptive Personality Engine (initialized when a pet exists)
        this.personality = null;

        // Memory Scrapbook
        this.scrapbook = new Scrapbook();

        // Reports data
        this.statHistory = [];   // periodic stat snapshots { ts, health, happiness, hunger, energy, cleanliness }
        this.startDate   = null; // when this game was first started
        this._statTick   = 0;
    }

    // ── Setup ─────────────────────────────────────────────────────────────────

    startNew(name, type, color, personality) {
        this.pet = new Pet(name, type, color, personality);
        this.coins       = GAME_CONFIG.STARTING_COINS;
        this.totalSpent  = 0;
        this.totalEarned = 0;
        this.spentByCategory = {};
        this.choreCooldowns  = {};
        this.totalChoresDone = 0;
        this.unlockedBadges  = [];
        this.activityLog     = [];
        this.isRunning   = true;
        this.personality = new PersonalityEngine(this);
        this.startDate   = Date.now();
        this.statHistory = [];
        this._statTick   = 0;
        this.scrapbook   = new Scrapbook();
        this.scrapbook.onGameStart(name, type, this);
        this._log(`${name} the ${PET_TYPES[type].name} joined PetPal AI!`);
        return true;
    }

    // ── Actions ───────────────────────────────────────────────────────────────

    doAction(actionId) {
        if (!this.isRunning || !this.pet) return { success: false, message: 'No active pet.' };

        const action = ACTIONS[actionId];
        if (!action) return { success: false, message: 'Unknown action.' };

        // Two-phase validation: coin check runs first because it is unconditional —
        // if the player can't afford the action there is no point evaluating whether
        // the pet needs it. Feasibility runs second and can return ok:true with an
        // advisory string (e.g. "pet isn't hungry but a snack won't hurt"), which
        // is forwarded to the UI as an amber info toast alongside the success result.
        // Reversing the order would surface pet-state messages even when the player
        // lacks the coins to act on them.
        const coinCheck = Validator.coins(this.coins, action.cost);
        if (!coinCheck.ok) return { success: false, message: coinCheck.message };

        const feasibility = Validator.action(this.pet, actionId);
        if (!feasibility.ok) {
            return { success: false, message: feasibility.message, soft: feasibility.soft };
        }

        // Store level before action so we can detect a level-up after.
        const prevLevel = this.pet.level;
        const result = this.pet.performAction(actionId);
        if (!result.success) return result;

        if (action.cost > 0) {
            const prevSpent  = this.totalSpent;
            this.coins      -= action.cost;
            // clampCoins is a safety floor: floating-point subtraction could
            // theoretically produce -0.000001, so we force the minimum to 0.
            this.coins       = Validator.clampCoins(this.coins);
            this.totalSpent += action.cost;
            this.spentByCategory[action.category] =
                (this.spentByCategory[action.category] || 0) + action.cost;

            // Persist each expense individually so the Reports tab can chart
            // spending over time, not just the running total.
            this.storage.saveExpense({
                action: actionId,
                label: action.label,
                category: action.category,
                cost: action.cost,
                coinsAfter: this.coins
            });

            // Trigger scrapbook milestones only when a threshold is first crossed
            // (prevSpent < m and now totalSpent >= m), not on every action after.
            for (const m of [100, 500, 1000]) {
                if (prevSpent < m && this.totalSpent >= m) {
                    this.scrapbook?.onCoinMilestone(m, this);
                }
            }
        }

        // Funny personality's coin bonus is resolved here (in Game, not Pet) so
        // the financial ledger stays in one place.
        if (result.bonusCoin) {
            const bonus = Math.floor(Math.random() * 10) + 5;
            this.coins       += bonus;
            this.totalEarned += bonus;
            result.message   += ` (+${bonus} coins bonus!)`;
            this.storage.saveIncome({ source: 'bonus', amount: bonus });
        }

        this._log(`${Icons.pixelSvg(action.icon, 14)} ${result.message}`);

        // PersonalityEngine tracks feed/play frequency to adjust the pet's
        // displayed personality trait over time.
        if (actionId === 'feed' || actionId === 'play') {
            this.personality?.recordAction(actionId);
        }

        this.scrapbook?.onAction(actionId, this);
        if (this.pet.level > prevLevel) {
            this.scrapbook?.onLevelUp(this.pet.level, this);
        }

        // Badge check runs after every action so newly-met conditions are
        // caught immediately rather than waiting for the next tick.
        const newBadges = this._checkBadges();

        return { ...result, newBadges, coins: this.coins, advisory: feasibility.advisory };
    }

    // ── Chores ────────────────────────────────────────────────────────────────

    doChore(choreId) {
        if (!this.isRunning) return { success: false, message: 'No active pet.' };

        const chore = CHORES.find(c => c.id === choreId);
        if (!chore) return { success: false, message: 'Unknown chore.' };

        const lastDone = this.choreCooldowns[choreId] || 0;
        const cooldownLeft = chore.cooldown - (Date.now() - lastDone);
        if (cooldownLeft > 0) {
            const mins = Math.ceil(cooldownLeft / 60000);
            return { success: false, message: `${chore.name} is on cooldown for ${mins} more minute${mins !== 1 ? 's' : ''}.` };
        }

        const prevLevel = this.pet?.level ?? 0;
        this.choreCooldowns[choreId] = Date.now();
        this.coins       += chore.reward;
        this.totalEarned += chore.reward;
        this.totalChoresDone++;

        this.storage.saveIncome({ source: 'chore', choreId, name: chore.name, amount: chore.reward });

        // Grant pet XP too
        let xpResult = null;
        if (this.pet) xpResult = this.pet.addXp(chore.xp);

        this._log(`Completed "${chore.name}" — earned ${chore.reward} coins!`);

        this.personality?.recordAction('chore');

        // Scrapbook recording
        this.scrapbook?.onChore(chore.name, this);
        if (this.pet && this.pet.level > prevLevel) {
            this.scrapbook?.onLevelUp(this.pet.level, this);
        }

        const newBadges = this._checkBadges();

        return { success: true, message: `${chore.name} done! +${chore.reward} coins`, reward: chore.reward, xpResult, newBadges, coins: this.coins };
    }

    getChoreCooldownInfo(choreId) {
        const chore = CHORES.find(c => c.id === choreId);
        if (!chore) return null;
        const lastDone = this.choreCooldowns[choreId] || 0;
        const elapsed  = Date.now() - lastDone;
        const remaining = Math.max(0, chore.cooldown - elapsed);
        const ready     = remaining === 0;
        return { ready, remaining, cooldown: chore.cooldown };
    }

    // ── Tick ─────────────────────────────────────────────────────────────────

    tick() {
        if (!this.isRunning || !this.pet) return {};

        const warnings = this.pet.tick();
        const newBadges = this._checkBadges();

        // Scrapbook: health transitions + day milestones
        if (this.scrapbook) {
            this.scrapbook.checkHealthTransition(this);
            if (this.startDate) {
                const days = Math.floor((Date.now() - this.startDate) / 86400000);
                this.scrapbook.onDayTogether(days, this);
            }
        }

        // Stat snapshot every 22 ticks (~88 s at 4 s/tick)
        this._statTick++;
        if (this._statTick % 22 === 0) this._recordStatSnapshot();

        return { warnings, newBadges };
    }

    _recordStatSnapshot() {
        const p = this.pet;
        if (!p) return;
        // Snapshot all five stats with a timestamp so the Reports chart can
        // plot trends over the session rather than just the current values.
        this.statHistory.push({
            ts:          Date.now(),
            health:      Math.round(p.health),
            happiness:   Math.round(p.happiness),
            hunger:      Math.round(p.hunger),
            energy:      Math.round(p.energy),
            cleanliness: Math.round(p.cleanliness)
        });
        // Cap at 600 entries (~14 hours of data at one snapshot every 88 s).
        // Older entries are dropped to keep localStorage usage manageable.
        if (this.statHistory.length > 600) this.statHistory.shift();
    }

    // ── Badges ────────────────────────────────────────────────────────────────

    _checkBadges() {
        const newOnes = [];
        BADGES.forEach(badge => {
            // Skip badges the player already has; each badge is a one-time award.
            if (!this.unlockedBadges.includes(badge.id) && badge.check(this)) {
                this.unlockedBadges.push(badge.id);
                newOnes.push(badge);
                this._log(`Badge unlocked: ${badge.name}`);
                this.scrapbook?.onBadge(badge, this);
            }
        });
        // Return only the newly unlocked badges so the UI can show a pop-up
        // just for this tick, not for every badge the player already owns.
        return newOnes;
    }

    // ── Save / Load ───────────────────────────────────────────────────────────

    save() {
        if (!this.pet) return false;
        return this.storage.saveGame({
            pet: this.pet.toJSON(),
            coins: this.coins,
            totalSpent: this.totalSpent,
            totalEarned: this.totalEarned,
            spentByCategory: this.spentByCategory,
            choreCooldowns: this.choreCooldowns,
            totalChoresDone: this.totalChoresDone,
            unlockedBadges: this.unlockedBadges,
            activityLog: this.activityLog.slice(-50),
            startDate: this.startDate,
            statHistory: this.statHistory.slice(-600),
            scrapbook: this.scrapbook?.toJSON(),
        });
    }

    load() {
        const data = this.storage.loadGame();
        if (!data) return false;
        try {
            this.pet             = Pet.fromJSON(data.pet);
            this.coins           = data.coins           ?? GAME_CONFIG.STARTING_COINS;
            this.totalSpent      = data.totalSpent      ?? 0;
            this.totalEarned     = data.totalEarned     ?? 0;
            this.spentByCategory = data.spentByCategory ?? {};
            this.choreCooldowns  = data.choreCooldowns  ?? {};
            this.totalChoresDone = data.totalChoresDone ?? 0;
            this.unlockedBadges  = data.unlockedBadges  ?? [];
            this.activityLog     = data.activityLog     ?? [];
            this.startDate       = data.startDate   ?? Date.now();
            this.statHistory     = data.statHistory ?? [];
            this.scrapbook       = Scrapbook.fromJSON(data.scrapbook);
            this.isRunning       = true;
            this.personality     = new PersonalityEngine(this);
            return true;
        } catch (e) {
            console.error('Load error:', e);
            return false;
        }
    }

    reset() {
        this.storage.clearAll();
        this.pet        = null;
        this.isRunning  = false;
        this.coins      = GAME_CONFIG.STARTING_COINS;
        this.totalSpent = 0;
        this.totalEarned = 0;
        this.spentByCategory = {};
        this.choreCooldowns  = {};
        this.totalChoresDone = 0;
        this.unlockedBadges  = [];
        this.activityLog     = [];
        this.scrapbook       = new Scrapbook();
        this.personality?.reset();
        this.personality     = null;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    _log(text) {
        const entry = { ts: Date.now(), text };
        this.activityLog.unshift(entry);
        if (this.activityLog.length > 50) this.activityLog.pop();
    }

    getFinanceSummary() {
        const expenses = this.storage.loadExpenses();
        const income   = this.storage.loadIncome();
        return {
            coins: this.coins,
            totalSpent: this.totalSpent,
            totalEarned: this.totalEarned,
            spentByCategory: this.spentByCategory,
            recentExpenses: expenses.slice(-10).reverse(),
            recentIncome: income.slice(-10).reverse()
        };
    }
}

if (typeof module !== 'undefined' && module.exports) module.exports = Game;
