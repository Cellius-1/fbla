/**
 * PETPAL AI - CONSTANTS
 * All game configuration, costs, effects, and data definitions.
 */

// ─── Game Loop ───────────────────────────────────────────────────────────────
const GAME_CONFIG = {
    TICK_INTERVAL: 4000,        // ms between stat updates
    STARTING_COINS: 250,
    STORAGE_KEY: 'petpal_ai_v2',
    MAX_LEVEL: 10,
    XP_PER_LEVEL: 100           // 100 XP per level, max 1000 XP total
};

// ─── Pet Types ────────────────────────────────────────────────────────────────
const PET_TYPES = {
    dog:    { emoji: '🐕', name: 'Dog',    description: 'Loyal & playful companion',  bgHue: 45  },
    cat:    { emoji: '🐱', name: 'Cat',    description: 'Independent & graceful',      bgHue: 270 },
    rabbit: { emoji: '🐰', name: 'Rabbit', description: 'Quick & curious friend',      bgHue: 330 },
    bird:   { emoji: '🐦', name: 'Bird',   description: 'Colorful & vocal partner',    bgHue: 200 }
};

// ─── Pet Colors ───────────────────────────────────────────────────────────────
const PET_COLORS = {
    golden:  { name: 'Golden',    hex: '#f59e0b', glow: 'rgba(245,158,11,0.35)' },
    brown:   { name: 'Brown',     hex: '#92400e', glow: 'rgba(146,64,14,0.35)'  },
    white:   { name: 'Cookie White',hex: '#e5e7eb', glow: 'rgba(229,231,235,0.4)' },
    midnight:{ name: 'Midnight',  hex: '#1e3a5f', glow: 'rgba(30,58,95,0.45)'   },
    lavender:{ name: 'Lavender',  hex: '#a78bfa', glow: 'rgba(167,139,250,0.4)' },
    coral:   { name: 'Coral',     hex: '#f87171', glow: 'rgba(248,113,113,0.4)' }
};

// ─── Personalities ─────────────────────────────────────────────────────────────
const PERSONALITIES = {
    friendly:  {
        name: 'Friendly',  emoji: '🤗',
        desc: 'Loves attention! Gets +15% happiness from all care.',
        effect: 'happinessBonus'
    },
    energetic: {
        name: 'Energetic', emoji: '⚡',
        desc: 'Full of life! Earns +25% XP from play but tires faster.',
        effect: 'energeticBonus'
    },
    shy:       {
        name: 'Shy',       emoji: '🙈',
        desc: 'Loves quiet time. Gains +30% energy from sleep.',
        effect: 'sleepBonus'
    },
    wise:      {
        name: 'Wise',      emoji: '🦉',
        desc: 'Quick learner! Earns +20% XP from every action.',
        effect: 'xpBonus'
    },
    funny:     {
        name: 'Funny',     emoji: '😄',
        desc: 'Always cheerful! Has a 15% chance to earn bonus coins.',
        effect: 'coinBonus'
    }
};

// ─── Emotions ─────────────────────────────────────────────────────────────────
const EMOTIONS = {
    ecstatic: { emoji: '🤩', label: 'Ecstatic!',     color: '#fbbf24' },
    happy:    { emoji: '😊', label: 'Happy',          color: '#34d399' },
    neutral:  { emoji: '😐', label: 'Okay',           color: '#9ca3af' },
    sad:      { emoji: '😢', label: 'Sad',            color: '#60a5fa' },
    hungry:   { emoji: '😩', label: 'Very Hungry!',   color: '#f97316' },
    tired:    { emoji: '😴', label: 'Exhausted',      color: '#a78bfa' },
    sick:     { emoji: '🤒', label: 'Sick',           color: '#f87171' },
    dirty:    { emoji: '😤', label: 'Feeling Dirty',  color: '#86efac' }
};

// ─── Action Definitions ───────────────────────────────────────────────────────
// All stat effects: positive = increase stat (better), negative = decrease (worse)
// All stats are 0–100 where 100 = best
const ACTIONS = {
    feed: {
        label: 'Feed',    icon: 'feed', cost: 15, category: 'food',
        xp: 5,
        effects: { hunger: +35, happiness: +5,  health: +2 },
        message: ['Nom nom! {{name}} loves the food!', '{{name}} gobbles everything up!', 'Mmm! {{name}} is satisfied!']
    },
    play: {
        label: 'Play',    icon: 'play_circle', cost: 10, category: 'toys',
        xp: 8,
        effects: { happiness: +20, energy: -15, hunger: -8, cleanliness: -5, health: +3 },
        message: ['Wheee! {{name}} is having a blast!', '{{name}} zooms around happily!', 'Play time is the best time!']
    },
    sleep: {
        label: 'Sleep',   icon: 'moon', cost: 0, category: 'free',
        xp: 3,
        effects: { energy: +40, health: +5, hunger: -5 },
        message: ['Zzz... {{name}} is resting peacefully.', '{{name}} drifts off to sleep.', 'Sweet dreams, {{name}}!']
    },
    clean: {
        label: 'Clean',   icon: 'droplets', cost: 12, category: 'cleaning',
        xp: 5,
        effects: { cleanliness: +35, health: +8, happiness: +5 },
        message: ['{{name}} is sparkling clean!', 'Fresh and fluffy!', '{{name}} feels so fresh!']
    },
    vet: {
        label: 'Vet Visit', icon: 'medical_cross', cost: 35, category: 'vet',
        xp: 10,
        effects: { health: +30, happiness: +5 },
        message: ['The vet gives {{name}} a clean bill of health!', '{{name}} got checked out — all good!', 'Health check complete!']
    }
};

// ─── Stat Degradation per Tick ────────────────────────────────────────────────
const STAT_DEGRADATION = {
    hunger:      1.5,   // pet gets hungry
    happiness:   0.5,
    health:      0.2,   // mild baseline
    energy:      0.8,
    cleanliness: 0.7
};

// ─── Chores (income system) ────────────────────────────────────────────────────
const CHORES = [
    { id: 'dishes',     name: 'Wash the Dishes',      icon: 'feed',          reward: 20, xp: 10, cooldown: 5  * 60000, desc: 'A quick chore for some coins.' },
    { id: 'room',       name: 'Clean Your Room',       icon: 'sparkle',       reward: 25, xp: 15, cooldown: 15 * 60000, desc: 'Tidy up for a decent reward.' },
    { id: 'plants',     name: 'Water the Plants',      icon: 'heart',         reward: 15, xp:  8, cooldown: 10 * 60000, desc: 'Help the garden grow.' },
    { id: 'trash',      name: 'Take Out the Trash',    icon: 'trash',         reward: 15, xp:  8, cooldown: 10 * 60000, desc: 'Keep the house clean.' },
    { id: 'dog_walk',   name: "Walk Neighbor's Dog",   icon: 'paw',           reward: 35, xp: 20, cooldown: 30 * 60000, desc: 'Earn big for a longer task.' },
    { id: 'groceries',  name: 'Help with Groceries',   icon: 'coin',          reward: 30, xp: 15, cooldown: 20 * 60000, desc: 'Carry bags for extra coins.' }
];

// ─── Badges ───────────────────────────────────────────────────────────────────
const BADGES = [
    { id: 'first_steps',  name: 'First Steps',       icon: 'paw',           desc: 'Perform your first care action.',        check: g => g.pet.totalActions >= 1 },
    { id: 'feeding_pro',  name: 'Feeding Pro',        icon: 'feed',          desc: 'Feed your pet 10 times.',               check: g => g.pet.feedCount >= 10 },
    { id: 'playmate',     name: 'Playmate',           icon: 'play_circle',   desc: 'Play with your pet 20 times.',           check: g => g.pet.playCount >= 20 },
    { id: 'night_owl',    name: 'Night Owl',          icon: 'moon',          desc: 'Put your pet to sleep 10 times.',        check: g => g.pet.sleepCount >= 10 },
    { id: 'clean_freak',  name: 'Clean Freak',        icon: 'droplets',      desc: 'Clean your pet 15 times.',               check: g => g.pet.cleanCount >= 15 },
    { id: 'vet_regular',  name: 'Vet Regular',        icon: 'medical_cross', desc: 'Visit the vet 5 times.',                 check: g => g.pet.vetCount >= 5 },
    { id: 'chore_star',   name: 'Chore Star',         icon: 'star',          desc: 'Complete 10 chores.',                    check: g => g.totalChoresDone >= 10 },
    { id: 'money_maker',  name: 'Money Maker',        icon: 'coin',          desc: 'Earn 200 coins from chores.',            check: g => g.totalEarned >= 200 },
    { id: 'big_saver',    name: 'Big Saver',          icon: 'award',         desc: 'Earn 500 coins total.',                  check: g => g.totalEarned >= 500 },
    { id: 'level_five',   name: 'Growing Up',         icon: 'sparkle',       desc: 'Reach Level 5.',                         check: g => g.pet.level >= 5 },
    { id: 'level_ten',    name: 'Pet Master',         icon: 'trophy',        desc: 'Reach Level 10.',                        check: g => g.pet.level >= 10 },
    { id: 'all_well',     name: 'Perfect Care',       icon: 'heart',         desc: 'Keep all stats above 70 simultaneously.', check: g => ['hunger','happiness','health','energy','cleanliness'].every(s => g.pet[s] >= 70) }
];

// ─── Tricks (unlocked by level) ───────────────────────────────────────────────
const TRICKS = [
    { id: 'sit',         name: 'Sit',              icon: 'paw',         level: 2,  desc: '{{name}} learned to sit on command!' },
    { id: 'shake',       name: 'Shake Hands',      icon: 'paw',         level: 3,  desc: '{{name}} can shake your hand!' },
    { id: 'roll_over',   name: 'Roll Over',         icon: 'bolt',        level: 4,  desc: '{{name}} can roll over!' },
    { id: 'dance',       name: 'Dance',             icon: 'sparkle',     level: 5,  desc: '{{name}} knows how to dance!' },
    { id: 'spin',        name: 'Spin',              icon: 'sparkle',     level: 6,  desc: '{{name}} can spin in circles!' },
    { id: 'jump',        name: 'High Jump',         icon: 'bolt',        level: 7,  desc: '{{name}} can jump really high!' },
    { id: 'speak',       name: 'Speak',             icon: 'message',     level: 8,  desc: '{{name}} can speak on command!' },
    { id: 'handstand',   name: 'Handstand',         icon: 'bolt',        level: 9,  desc: '{{name}} can do a handstand!' },
    { id: 'perform',     name: 'Grand Performance', icon: 'trophy',      level: 10, desc: '{{name}} performs a dazzling show!' }
];

// ─── Stat color mapping ───────────────────────────────────────────────────────
const STAT_COLORS = {
    hunger:      '#f97316',
    happiness:   '#ec4899',
    health:      '#10b981',
    energy:      '#6366f1',
    cleanliness: '#06b6d4'
};

const STAT_ICONS = {
    hunger:      'feed',
    happiness:   'heart',
    health:      'shield',
    energy:      'bolt',
    cleanliness: 'droplets'
};

// ─── Spending category display ────────────────────────────────────────────────
const CATEGORIES = {
    food:     { label: 'Food',              icon: 'feed',          color: '#f97316' },
    toys:     { label: 'Toys & Play',       icon: 'play_circle',   color: '#ec4899' },
    cleaning: { label: 'Cleaning Supplies', icon: 'droplets',      color: '#06b6d4' },
    vet:      { label: 'Vet Visits',        icon: 'medical_cross', color: '#10b981' },
    free:     { label: 'Free',              icon: 'moon',          color: '#8b5cf6' }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GAME_CONFIG, PET_TYPES, PET_COLORS, PERSONALITIES, EMOTIONS, ACTIONS,
        STAT_DEGRADATION, CHORES, BADGES, TRICKS, STAT_COLORS, STAT_ICONS, CATEGORIES };
}
