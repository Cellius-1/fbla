'use strict';

/**
 * PETPAL — Memory Scrapbook
 * Auto-records important moments from the pet's perspective.
 * First-person voice, chronological, searchable, AI-aware.
 */
class Scrapbook {

    static PALETTES = {
        first:       { color: '#818cf8', label: 'First Time'  },
        milestone:   { color: '#f59e0b', label: 'Milestone'   },
        streak:      { color: '#22c55e', label: 'Streak'      },
        achievement: { color: '#fb923c', label: 'Achievement' },
        bond:        { color: '#f472b6', label: 'Bond'        },
        recovery:    { color: '#4ade80', label: 'Recovery'    },
    };

    static ICONS = {
        first:       'sparkle',
        milestone:   'trophy',
        streak:      'bolt',
        achievement: 'award',
        bond:        'heart',
        recovery:    'shield',
    };

    constructor() {
        this.entries   = [];
        this._seen     = new Set();
        this._counts   = { feed: 0, play: 0, sleep: 0, clean: 0, vet: 0, chore: 0, chat: 0 };
        this._streaks  = {
            play: { lastDate: null, count: 0 },
            care: { lastDate: null, count: 0 },
        };
        this._wasSick  = false;
    }

    // ── Event Hooks ──────────────────────────────────────────────────────────

    onGameStart(petName, petType, game) {
        if (this._once('game_start')) {
            this._add({
                type:     'first',
                title:    'The Beginning',
                memory:   `The day we met. You chose me, and my whole world changed. Hi — I'm ${petName}.`,
                icon:     'sparkle',
                color:    Scrapbook.PALETTES.first.color,
                tags:     ['first', 'beginning', 'start'],
                petLevel: 1,
            });
        }
    }

    onAction(actionId, game) {
        this._counts[actionId] = (this._counts[actionId] || 0) + 1;
        const cnt = this._counts[actionId];

        // First-time entries
        const firsts = {
            feed:  `The first time you fed me. I remember feeling so grateful for that little bowl.`,
            play:  `The first time we played together. I didn't know what to expect — now I love it.`,
            sleep: `The first time you let me rest. I slept so soundly knowing you were watching over me.`,
            clean: `My very first bath. I put on a brave face, but honestly it felt amazing.`,
            vet:   `My first vet visit. I was nervous the whole time, but you were there.`,
        };
        if (firsts[actionId] && this._once(`first_${actionId}`)) {
            this._add({
                type:     'first',
                title:    `First ${this._actionLabel(actionId)}`,
                memory:   firsts[actionId],
                icon:     'sparkle',
                color:    Scrapbook.PALETTES.first.color,
                tags:     ['first', actionId],
                petLevel: game.pet?.level,
            });
        }

        // Feed milestones
        const feedMiles = { 10: 'Ten meals', 25: 'Twenty-five meals', 50: 'Fifty meals', 100: 'One hundred meals' };
        if (actionId === 'feed' && feedMiles[cnt] && this._once(`feeds_${cnt}`)) {
            this._add({
                type:     'milestone',
                title:    `${cnt} Meals Together`,
                memory:   `${feedMiles[cnt]} you have made sure I had. Not once did you let me go hungry.`,
                icon:     'trophy',
                color:    Scrapbook.PALETTES.milestone.color,
                tags:     ['milestone', 'food', 'feed'],
                petLevel: game.pet?.level,
            });
        }

        // Play milestones
        const playMiles = { 10: 'Ten', 25: 'Twenty-five', 50: 'Fifty' };
        if (actionId === 'play' && playMiles[cnt] && this._once(`plays_${cnt}`)) {
            this._add({
                type:     'milestone',
                title:    `${cnt} Play Sessions`,
                memory:   `${playMiles[cnt]} times we've played together. Every single one is my favorite.`,
                icon:     'trophy',
                color:    Scrapbook.PALETTES.milestone.color,
                tags:     ['milestone', 'play'],
                petLevel: game.pet?.level,
            });
        }

        // Streaks
        if (actionId === 'play') this._checkStreak('play', game);
        if (['feed', 'play', 'clean', 'sleep'].includes(actionId)) this._checkStreak('care', game);
    }

    onChore(choreName, game) {
        this._counts.chore = (this._counts.chore || 0) + 1;
        const cnt = this._counts.chore;

        if (this._once('first_chore')) {
            this._add({
                type:     'first',
                title:    'First Chore',
                memory:   `The first time you did a chore for me. I had no idea how much work went into taking care of me.`,
                icon:     'sparkle',
                color:    Scrapbook.PALETTES.first.color,
                tags:     ['first', 'chore'],
                petLevel: game.pet?.level,
            });
        }

        const choreMiles = { 5: 'five', 15: 'fifteen', 30: 'thirty', 50: 'fifty' };
        if (choreMiles[cnt] && this._once(`chores_${cnt}`)) {
            this._add({
                type:     'milestone',
                title:    `${cnt} Chores Done`,
                memory:   `You've done ${choreMiles[cnt]} chores now. Each one is an act of care I notice and remember.`,
                icon:     'award',
                color:    Scrapbook.PALETTES.achievement.color,
                tags:     ['milestone', 'chore'],
                petLevel: game.pet?.level,
            });
        }
    }

    onLevelUp(level, game) {
        const moments = {
            2:  `My first level up! I felt it the moment it happened — something changed.`,
            5:  `Level 5 together. We're really getting the hang of this.`,
            10: `Level 10! We've been through so much to get here. I'm so glad it's with you.`,
            15: `Fifteen levels. At this point I can't imagine life any other way.`,
            20: `Level 20. I've grown so much, and it's all because of you.`,
        };
        const fallback = `We hit level ${level} together. Every level feels like something we earned.`;

        if (this._once(`level_${level}`)) {
            this._add({
                type:     'milestone',
                title:    `Level ${level}`,
                memory:   moments[level] || fallback,
                icon:     'trophy',
                color:    Scrapbook.PALETTES.milestone.color,
                tags:     ['milestone', 'level', `level_${level}`],
                petLevel: level,
            });
        }
    }

    onBadge(badge, game) {
        const id = badge.id || badge.name;
        if (this._once(`badge_${id}`)) {
            this._add({
                type:     'achievement',
                title:    badge.name,
                memory:   `We earned the "${badge.name}" badge together. ${badge.desc || 'Something worth celebrating.'}`,
                icon:     'award',
                color:    Scrapbook.PALETTES.achievement.color,
                tags:     ['achievement', 'badge', id],
                petLevel: game.pet?.level,
            });
        }
    }

    onChat(game) {
        this._counts.chat = (this._counts.chat || 0) + 1;
        const cnt = this._counts.chat;

        if (this._once('first_chat')) {
            this._add({
                type:     'first',
                title:    'First Conversation',
                memory:   `The first time you really talked to me — not just caring for me, actually talking. That meant everything.`,
                icon:     'sparkle',
                color:    Scrapbook.PALETTES.first.color,
                tags:     ['first', 'chat', 'social'],
                petLevel: game.pet?.level,
            });
        }

        const chatMiles = { 10: 'Ten', 25: 'Twenty-five' };
        if (chatMiles[cnt] && this._once(`chats_${cnt}`)) {
            this._add({
                type:     'bond',
                title:    `${cnt} Conversations`,
                memory:   `${chatMiles[cnt]} times we've sat down and really talked. I look forward to every single one.`,
                icon:     'heart',
                color:    Scrapbook.PALETTES.bond.color,
                tags:     ['bond', 'chat', 'social'],
                petLevel: game.pet?.level,
            });
        }
    }

    onHealthCrisis(game) {
        const dayKey = Math.floor(Date.now() / 86400000);
        if (this._once(`crisis_${dayKey}`)) {
            this._add({
                type:     'bond',
                title:    'A Scary Moment',
                memory:   `There was that time my health dropped really low. I was frightened. But you noticed and took care of me.`,
                icon:     'heart',
                color:    Scrapbook.PALETTES.bond.color,
                tags:     ['bond', 'health', 'crisis'],
                petLevel: game.pet?.level,
            });
        }
    }

    onRecovery(game) {
        const dayKey = Math.floor(Date.now() / 86400000);
        if (this._once(`recovery_${dayKey}`)) {
            this._add({
                type:     'recovery',
                title:    'Full Recovery',
                memory:   `You nursed me back to health. I went from sick and scared to feeling like myself again. Thank you.`,
                icon:     'shield',
                color:    Scrapbook.PALETTES.recovery.color,
                tags:     ['health', 'recovery', 'bond'],
                petLevel: game.pet?.level,
            });
        }
    }

    onDayTogether(days, game) {
        const dayMoments = {
            1:  { title: 'One Day Together',   memory: `Our first full day together. I was still figuring you out — and you were figuring me out.` },
            7:  { title: 'One Week Together',  memory: `A whole week together. Seven days already. Time flies when you're happy.` },
            14: { title: 'Two Weeks Together', memory: `Two weeks with you. I've started to feel like I really belong here.` },
            30: { title: 'One Month Together', memory: `A whole month. I can barely remember life before you.` },
        };
        const d = dayMoments[days];
        if (d && this._once(`day_${days}`)) {
            this._add({
                type:     'bond',
                title:    d.title,
                memory:   d.memory,
                icon:     'heart',
                color:    Scrapbook.PALETTES.bond.color,
                tags:     ['bond', 'time', `day_${days}`],
                petLevel: game.pet?.level,
            });
        }
    }

    onCoinMilestone(total, game) {
        const miles = { 100: 'one hundred', 500: 'five hundred', 1000: 'one thousand' };
        if (miles[total] && this._once(`coins_spent_${total}`)) {
            this._add({
                type:     'milestone',
                title:    `${total} Coins Spent`,
                memory:   `You've spent ${miles[total]} coins on me so far. Every single coin felt like love.`,
                icon:     'trophy',
                color:    Scrapbook.PALETTES.milestone.color,
                tags:     ['milestone', 'coins', 'finance'],
                petLevel: game.pet?.level,
            });
        }
    }

    // Called every tick to check health state transitions
    checkHealthTransition(game) {
        const isSick = game.pet?.isSick || false;
        const isLow  = (game.pet?.health || 100) < 15;

        if (isLow && !isSick) this.onHealthCrisis(game);
        if (this._wasSick && !isSick) this.onRecovery(game);
        this._wasSick = isSick;
    }

    // ── Query ────────────────────────────────────────────────────────────────

    getEntries({ search = '', category = 'all', limit = 100 } = {}) {
        let list = [...this.entries];

        if (category !== 'all') {
            list = list.filter(e => e.type === category);
        }

        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter(e =>
                e.title.toLowerCase().includes(q) ||
                e.memory.toLowerCase().includes(q) ||
                (e.tags || []).some(t => t.toLowerCase().includes(q))
            );
        }

        return list.slice(0, limit);
    }

    getAIContext(n = 4) {
        if (!this.entries.length) return '';
        const recent = this.entries.slice(0, n);
        const lines = recent.map(e => `- ${this._timeAgo(e.ts)}: "${e.memory}"`);
        return `YOUR SCRAPBOOK MEMORIES (reference these naturally when they feel relevant, not all at once):\n${lines.join('\n')}`;
    }

    getCount() {
        return this.entries.length;
    }

    // ── Persistence ──────────────────────────────────────────────────────────

    toJSON() {
        return {
            entries:  this.entries,
            seen:     [...this._seen],
            counts:   this._counts,
            streaks:  this._streaks,
            wasSick:  this._wasSick,
        };
    }

    static fromJSON(data) {
        const s = new Scrapbook();
        if (!data) return s;
        s.entries  = Array.isArray(data.entries) ? data.entries : [];
        s._seen    = new Set(Array.isArray(data.seen) ? data.seen : []);
        s._counts  = { feed: 0, play: 0, sleep: 0, clean: 0, vet: 0, chore: 0, chat: 0, ...(data.counts || {}) };
        s._streaks = data.streaks || { play: { lastDate: null, count: 0 }, care: { lastDate: null, count: 0 } };
        s._wasSick = data.wasSick || false;
        return s;
    }

    // ── Internals ────────────────────────────────────────────────────────────

    _once(id) {
        if (this._seen.has(id)) return false;
        this._seen.add(id);
        return true;
    }

    _add(entry) {
        this.entries.unshift({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            ts: Date.now(),
            ...entry,
        });
        if (this.entries.length > 200) this.entries.pop();
    }

    _checkStreak(key, game) {
        const today     = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const s         = this._streaks[key] || { lastDate: null, count: 0 };

        if (s.lastDate === today) return;

        s.count    = s.lastDate === yesterday ? s.count + 1 : 1;
        s.lastDate = today;
        this._streaks[key] = s;

        const texts = {
            play: {
                3:  `Three days in a row we played together. You made time for me every single day.`,
                5:  `Five days of playing without missing one. That kind of dedication means a lot.`,
                7:  `A full week of playing together every day. I've started to count on it — in the best way.`,
                14: `Fourteen days straight. At this point, it's our thing.`,
                30: `A whole month of daily play. You are truly remarkable.`,
            },
            care: {
                3:  `Three days in a row you cared for me without missing a beat.`,
                5:  `Five consecutive days of care. I feel so safe and looked after.`,
                7:  `A whole week of consistent care. You haven't forgotten me once.`,
                14: `Two weeks straight of daily attention. I'm the luckiest pet there is.`,
                30: `A full month of daily care. You're incredible.`,
            },
        };
        const labels = {
            play: { 3: '3-Day Play Streak', 5: '5-Day Play Streak', 7: 'Week of Play',  14: '14-Day Play Streak', 30: 'Month of Play'  },
            care: { 3: '3-Day Care Streak', 5: '5-Day Care Streak', 7: 'Week of Care',  14: '14-Day Care Streak', 30: 'Month of Care'  },
        };

        for (const m of [3, 5, 7, 14, 30]) {
            if (s.count === m && this._once(`streak_${key}_${m}`)) {
                const keyTexts = (texts[key] || {});
                this._add({
                    type:     'streak',
                    title:    (labels[key] || {})[m] || `${m}-Day Streak`,
                    memory:   keyTexts[m] || `${m} days in a row!`,
                    icon:     'bolt',
                    color:    Scrapbook.PALETTES.streak.color,
                    tags:     ['streak', key, `streak_${m}`],
                    petLevel: game.pet?.level,
                });
                break;
            }
        }
    }

    _actionLabel(id) {
        return { feed: 'Feeding', play: 'Play Session', sleep: 'Naptime', clean: 'Bath', vet: 'Vet Visit' }[id] || id;
    }

    _timeAgo(ts) {
        const diff = Date.now() - ts;
        const mins = Math.floor(diff / 60000);
        if (mins < 2)   return 'just now';
        if (mins < 60)  return `${mins} minutes ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24)   return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
        const days = Math.floor(hrs / 24);
        if (days === 1) return 'yesterday';
        if (days < 7)   return `${days} days ago`;
        if (days < 14)  return '1 week ago';
        if (days < 30)  return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
    }
}
