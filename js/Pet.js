/**
 * PETPAL AI - Pet Class
 * Manages pet state, stats, leveling, tricks, and behavior.
 */

class Pet {
    constructor(name, type, color, personality) {
        this.name = name;
        this.type = type;
        this.color = color;
        this.personality = personality;
        this.createdAt = Date.now();

        // Core stats — 0 to 100, higher = better
        this.hunger      = 100;
        this.happiness   = 100;
        this.health      = 100;
        this.energy      = 100;
        this.cleanliness = 100;

        // Growth
        this.totalXp  = 0;
        this.level    = 1;
        this.tricks   = [];       // array of trick ids learned

        // Tracking
        this.totalActions = 0;
        this.feedCount    = 0;
        this.playCount    = 0;
        this.sleepCount   = 0;
        this.cleanCount   = 0;
        this.vetCount     = 0;

        // State
        this.isSick       = false;
        this.happyStreak  = 0;    // consecutive ticks with happiness > 80
    }

    // ── Derived state ─────────────────────────────────────────────────────────

    getEmotion() {
        if (this.isSick)            return EMOTIONS.sick;
        if (this.health < 25)       return EMOTIONS.sick;
        if (this.hunger < 20)       return EMOTIONS.hungry;
        if (this.energy < 20)       return EMOTIONS.tired;
        if (this.cleanliness < 20)  return EMOTIONS.dirty;
        if (this.happiness < 25)    return EMOTIONS.sad;
        if (this.happiness > 85 && this.health > 70) return EMOTIONS.ecstatic;
        if (this.happiness > 60)    return EMOTIONS.happy;
        return EMOTIONS.neutral;
    }

    getMoodText() {
        const e = this.getEmotion();
        const lines = {
            ecstatic: `${this.name} is absolutely thrilled!`,
            happy:    `${this.name} is happy and content.`,
            neutral:  `${this.name} is doing okay.`,
            sad:      `${this.name} looks a bit sad...`,
            hungry:   `${this.name} is starving! Please feed me!`,
            tired:    `${this.name} can barely keep their eyes open.`,
            sick:     `${this.name} is sick and needs the vet!`,
            dirty:    `${this.name} really needs a bath!`
        };
        return lines[Object.keys(EMOTIONS).find(k => EMOTIONS[k] === e)] || `${this.name} is here.`;
    }

    // ── XP & Leveling ─────────────────────────────────────────────────────────

    addXp(baseXp) {
        let xp = baseXp;

        // Personality bonuses
        const p = PERSONALITIES[this.personality];
        if (p) {
            if (p.effect === 'xpBonus')     xp = Math.round(xp * 1.20);
        }

        this.totalXp = Math.min(this.totalXp + xp, GAME_CONFIG.MAX_LEVEL * GAME_CONFIG.XP_PER_LEVEL);
        const newLevel = Math.min(GAME_CONFIG.MAX_LEVEL, Math.floor(this.totalXp / GAME_CONFIG.XP_PER_LEVEL) + 1);

        const leveledUp = newLevel > this.level;
        this.level = newLevel;

        // Check for new tricks
        const newTricks = [];
        TRICKS.forEach(trick => {
            if (trick.level === this.level && !this.tricks.includes(trick.id)) {
                this.tricks.push(trick.id);
                newTricks.push(trick);
            }
        });

        return { leveledUp, newTricks, xpGained: xp };
    }

    getXpInCurrentLevel() {
        return this.totalXp % GAME_CONFIG.XP_PER_LEVEL;
    }

    getXpToNextLevel() {
        return GAME_CONFIG.XP_PER_LEVEL;
    }

    // ── Actions ───────────────────────────────────────────────────────────────

    performAction(actionId) {
        const action = ACTIONS[actionId];
        if (!action) return { success: false, message: 'Unknown action.' };

        if (actionId === 'play' && this.energy < 10) {
            return { success: false, message: `${this.name} is too tired to play! Let them sleep first.` };
        }

        // Apply effects
        const personality = PERSONALITIES[this.personality];
        Object.entries(action.effects).forEach(([stat, delta]) => {
            let adjusted = delta;

            if (personality) {
                if (personality.effect === 'happinessBonus' && stat === 'happiness' && delta > 0) {
                    adjusted = Math.round(delta * 1.15);
                }
                if (personality.effect === 'sleepBonus' && stat === 'energy' && actionId === 'sleep') {
                    adjusted = Math.round(delta * 1.30);
                }
                if (personality.effect === 'energeticBonus' && actionId === 'play') {
                    if (stat === 'energy' && delta < 0) adjusted = Math.round(delta * 1.2);
                }
            }

            this[stat] = Math.max(0, Math.min(100, this[stat] + adjusted));
        });

        // Cure sickness on vet visit
        if (actionId === 'vet' && this.isSick) {
            this.isSick = false;
            this.health = Math.min(100, this.health + 15);
        }

        // Track counts
        this.totalActions++;
        if (actionId === 'feed')  this.feedCount++;
        if (actionId === 'play')  this.playCount++;
        if (actionId === 'sleep') this.sleepCount++;
        if (actionId === 'clean') this.cleanCount++;
        if (actionId === 'vet')   this.vetCount++;

        // Build XP
        let baseXp = action.xp;
        if (personality?.effect === 'energeticBonus' && actionId === 'play') baseXp = Math.round(baseXp * 1.25);

        const xpResult = this.addXp(baseXp);

        // Chance for bonus coin flag (funny personality)
        const bonusCoin = personality?.effect === 'coinBonus' && Math.random() < 0.15;

        const msgTemplate = action.message[Math.floor(Math.random() * action.message.length)];
        const message = msgTemplate.replace(/\{\{name\}\}/g, this.name);

        return { success: true, message, xpResult, bonusCoin };
    }

    // ── Periodic tick ─────────────────────────────────────────────────────────

    tick() {
        const warnings = [];

        // Degrade all stats
        this.hunger      = Math.max(0, this.hunger      - STAT_DEGRADATION.hunger);
        this.happiness   = Math.max(0, this.happiness   - STAT_DEGRADATION.happiness);
        this.energy      = Math.max(0, this.energy      - STAT_DEGRADATION.energy);
        this.cleanliness = Math.max(0, this.cleanliness - STAT_DEGRADATION.cleanliness);

        // Health degrades faster when other stats are critically low
        let healthDelta = STAT_DEGRADATION.health;
        if (this.hunger < 20)      healthDelta += 0.5;
        if (this.cleanliness < 20) healthDelta += 0.5;
        if (this.isSick)           healthDelta += 1.0;
        this.health = Math.max(0, this.health - healthDelta);

        // Track happy streak
        if (this.happiness > 80) this.happyStreak++;
        else this.happyStreak = 0;

        // Random sickness (higher chance when health/cleanliness low)
        if (!this.isSick && this.health < 40 && Math.random() < 0.03) {
            this.isSick = true;
            warnings.push('sick');
        }

        // Build warnings
        if (this.hunger < 25)      warnings.push('hungry');
        if (this.energy < 20)      warnings.push('tired');
        if (this.happiness < 25)   warnings.push('sad');
        if (this.cleanliness < 20) warnings.push('dirty');
        if (this.health < 25 && !warnings.includes('sick')) warnings.push('lowHealth');

        return warnings;
    }

    // ── Serialization ─────────────────────────────────────────────────────────

    toJSON() {
        return {
            name: this.name, type: this.type, color: this.color,
            personality: this.personality, createdAt: this.createdAt,
            hunger: this.hunger, happiness: this.happiness, health: this.health,
            energy: this.energy, cleanliness: this.cleanliness,
            totalXp: this.totalXp, level: this.level, tricks: this.tricks,
            totalActions: this.totalActions,
            feedCount: this.feedCount, playCount: this.playCount,
            sleepCount: this.sleepCount, cleanCount: this.cleanCount,
            vetCount: this.vetCount, isSick: this.isSick,
            happyStreak: this.happyStreak
        };
    }

    static fromJSON(data) {
        const pet = new Pet(data.name, data.type, data.color, data.personality);
        Object.assign(pet, data);
        // Guard against corrupted localStorage values
        if (typeof Validator !== 'undefined') Validator.sanitizeStats(pet);
        return pet;
    }
}

if (typeof module !== 'undefined' && module.exports) module.exports = Pet;
