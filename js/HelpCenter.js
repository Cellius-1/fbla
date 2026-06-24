/**
 * PETPAL AI — Help Center
 * Interactive FAQ panel with search, category filtering, and an
 * AI-style assistant backed by a local knowledge base (no API needed).
 */

// ─────────────────────────────────────────────────────────────────────────────
// FAQ DATA  (20 items, 7 categories)
// ─────────────────────────────────────────────────────────────────────────────

const FAQ_DATA = [
    {
        id: 'fq1', category: 'basics', icon: 'paw',
        question: 'How do I create a pet?',
        answer: 'Follow the 3-step wizard on the start screen: choose a pet type (dog, cat, rabbit, or bird), pick a color and personality, then give your pet a name (2–20 characters).',
        tip: 'Choose <strong>Wise</strong> for fast leveling or <strong>Funny</strong> for bonus coins — personality can\'t be changed later!',
        tags: ['new game', 'create', 'start', 'wizard', 'setup', 'begin']
    },
    {
        id: 'fq2', category: 'basics', icon: 'save',
        question: 'Does the game auto-save?',
        answer: 'Yes — the game auto-saves every 60 seconds (15 game ticks). You can also save manually anytime with <kbd>Ctrl+S</kbd> or the Save button in the top-right corner.',
        tip: 'Saves are stored in your browser\'s localStorage. Clearing browser data or using Incognito mode will erase your progress.',
        tags: ['save', 'auto-save', 'storage', 'progress', 'persist']
    },
    {
        id: 'fq3', category: 'stats', icon: 'bar_chart',
        question: 'What are the 5 pet stats?',
        answer: 'All stats range 0–100 (higher is always better) and degrade over time automatically:<ul class="faq-ul"><li><strong>Hunger</strong> — Feed your pet to keep this high.</li><li><strong>Happiness</strong> — Play with your pet to boost it.</li><li><strong>Health</strong> — Vet visits and overall care maintain this.</li><li><strong>Energy</strong> — Let your pet sleep to restore it.</li><li><strong>Cleanliness</strong> — Regular baths keep this up.</li></ul>',
        tip: 'When a stat drops below 25 you\'ll see a warning emotion and a notification toast.',
        tags: ['stats', 'hunger', 'happiness', 'health', 'energy', 'cleanliness', 'numbers', 'bars']
    },
    {
        id: 'fq4', category: 'stats', icon: 'heart',
        question: 'Why does my pet\'s health keep dropping?',
        answer: 'Health degrades naturally, but drops <strong>faster</strong> when:<ul class="faq-ul"><li>Hunger is below 20 (extra −0.5 per tick)</li><li>Cleanliness is below 20 (extra −0.5 per tick)</li><li>Your pet is sick (extra −1.0 per tick)</li></ul>Keeping hunger and cleanliness above 20 significantly slows health decay.',
        tip: 'A well-fed, clean pet loses health much slower — focus on hunger and cleanliness first.',
        tags: ['health', 'dropping', 'decreasing', 'low', 'decay', 'degrade', 'why']
    },
    {
        id: 'fq5', category: 'stats', icon: 'medical_cross',
        question: 'My pet got sick — what do I do?',
        answer: 'Visit the vet immediately! Click <strong>Vet Visit</strong> (costs 35 coins). The vet cures sickness and restores +30 Health and +5 Happiness. Sickness causes health to drop 2× faster, so don\'t delay.',
        tip: 'Pets have a 3% chance of falling sick each tick when health is below 40. Keep health above 40 to avoid this.',
        relatedTo: [{ label: 'How to earn 35 coins?', q: 'how do I earn coins' }],
        tags: ['sick', 'sickness', 'ill', 'vet', 'cure', 'heal', 'medicine', 'disease']
    },
    {
        id: 'fq6', category: 'coins', icon: 'coin',
        question: 'How do I earn coins?',
        answer: 'Open the <strong>Chores</strong> tab — there are 6 different chores available. Each chore rewards coins and pet XP. After completing one, a cooldown timer starts before you can repeat it.',
        tip: 'If your pet has the "Funny" personality, every care action has a 15% chance to award 5–14 bonus coins!',
        relatedTo: [
            { label: 'How chores work?', q: 'how do chores work' },
            { label: 'What do coins buy?', q: 'how much do actions cost' }
        ],
        tags: ['coins', 'earn', 'money', 'income', 'chore', 'reward', 'gold']
    },
    {
        id: 'fq7', category: 'coins', icon: 'chore',
        question: 'How do chores work?',
        answer: 'Each chore has a <strong>coin reward</strong>, a <strong>pet XP bonus</strong>, and a <strong>cooldown timer</strong>. Complete a chore → earn coins + XP → wait for the cooldown bar to refill → repeat. The cooldown time varies by chore.',
        tip: 'Do all available chores whenever they\'re ready — each one takes only a second and maximizes income.',
        tags: ['chore', 'cooldown', 'timer', 'work', 'task', 'job', 'repeat']
    },
    {
        id: 'fq8', category: 'coins', icon: 'wallet',
        question: 'How much do care actions cost?',
        answer: '<ul class="faq-ul"><li><strong>Feed</strong> — 15 coins</li><li><strong>Play</strong> — 10 coins</li><li><strong>Sleep</strong> — <em>Free!</em></li><li><strong>Clean</strong> — 12 coins</li><li><strong>Vet Visit</strong> — 35 coins</li></ul>',
        tip: 'Sleep is always free and also restores Health — use it often to save coins.',
        tags: ['cost', 'price', 'spend', 'buy', 'action', 'how much', 'coins', 'free']
    },
    {
        id: 'fq9', category: 'growth', icon: 'star',
        question: 'How do I level up?',
        answer: 'Every care action earns your pet XP. Accumulate <strong>100 XP to advance one level</strong> (max level 10). XP per action:<ul class="faq-ul"><li>Feed: 5 XP &nbsp;·&nbsp; Play: 8 XP &nbsp;·&nbsp; Sleep: 3 XP</li><li>Clean: 4 XP &nbsp;·&nbsp; Vet: 10 XP</li></ul>Watch the XP bar under your pet.',
        tip: 'The <strong>Wise</strong> personality grants +20% XP on ALL actions — the best for fast leveling.',
        relatedTo: [{ label: 'Unlock tricks?', q: 'how do I unlock tricks' }],
        tags: ['level', 'xp', 'experience', 'level up', 'grow', 'advance', 'progress', 'rank']
    },
    {
        id: 'fq10', category: 'growth', icon: 'trophy',
        question: 'How do I unlock tricks?',
        answer: 'Tricks unlock <strong>automatically</strong> when your pet reaches specific levels (Levels 2–10). There are 9 tricks total — each level brings a more impressive skill. Earned tricks appear in the <strong>Growth</strong> tab.',
        tip: 'A celebration popup appears each time a new trick is unlocked — keep an eye on the screen!',
        tags: ['tricks', 'skill', 'unlock', 'learn', 'level', 'abilities', 'new trick']
    },
    {
        id: 'fq11', category: 'growth', icon: 'award',
        question: 'How do I earn badges?',
        answer: 'There are <strong>12 badges</strong> awarded for hitting milestones:<ul class="faq-ul"><li>Feeding, playing, sleeping, cleaning, or vet-visiting N times</li><li>Reaching specific levels</li><li>Maintaining high happiness for many ticks</li><li>Completing chores</li></ul>View badges in the <strong>Growth</strong> tab.',
        tip: 'A badge notification pops up the moment you earn one!',
        tags: ['badges', 'achievement', 'medal', 'collect', 'milestone', 'unlock', '12', 'trophy']
    },
    {
        id: 'fq12', category: 'basics', icon: 'help',
        question: 'What does my pet\'s personality do?',
        answer: 'Each personality gives a unique permanent bonus:<ul class="faq-ul"><li><strong>Friendly</strong> — +15% happiness from play</li><li><strong>Energetic</strong> — +25% XP from play (uses more energy)</li><li><strong>Shy</strong> — +30% energy restored from sleep</li><li><strong>Wise</strong> — +20% XP from all actions</li><li><strong>Funny</strong> — 15% chance for 5–14 bonus coins per action</li></ul>',
        tip: 'You cannot change personality after creation — choose carefully!',
        tags: ['personality', 'type', 'bonus', 'friendly', 'energetic', 'shy', 'wise', 'funny', 'effect']
    },
    {
        id: 'fq13', category: 'basics', icon: 'dna',
        question: 'What is the Adaptive Personality Engine?',
        answer: 'Your <strong>care habits reshape your pet\'s traits</strong> over time. Four traits evolve based on weekly behavior:<ul class="faq-ul"><li><strong>Affection</strong> → grows with frequent feeding</li><li><strong>Energy</strong> → grows with frequent play</li><li><strong>Talkativeness</strong> → grows with frequent Dr. Paws chat sessions</li><li><strong>Mood</strong> → improves with overall good care</li></ul>View the evolution timeline in the <strong>Growth</strong> tab.',
        tip: 'Traits update smoothly after each action — check back after a few days of play.',
        tags: ['adaptive', 'personality', 'evolve', 'traits', 'affection', 'mood', 'talkativeness', 'timeline', 'dynamic']
    },
    {
        id: 'fq14', category: 'reports', icon: 'bar_chart',
        question: 'How do I view reports?',
        answer: 'Click the <strong>Reports</strong> tab. Four reports are available:<ul class="faq-ul"><li><strong>Expense</strong> — spending by category and monthly trend</li><li><strong>Health</strong> — health, happiness, hunger trends over time</li><li><strong>Achievement</strong> — badge/trick progress + level tracker</li><li><strong>Care History</strong> — feed, play, clean, vet counts + days active</li></ul>',
        tip: 'Use the date filter bar (7 / 30 / 90 days / All Time) to zoom into any period.',
        tags: ['reports', 'tab', 'charts', 'data', 'graphs', 'analytics', 'history', 'view']
    },
    {
        id: 'fq15', category: 'reports', icon: 'download',
        question: 'Can I download my reports?',
        answer: 'Yes! Every report card has a <strong>Save</strong> button in its header. Clicking it downloads a formatted <code>.txt</code> summary to your device. Files are named like <code>petpal-expense-2025-01-15.txt</code>. No data leaves your browser.',
        tip: 'Download reports before resetting your game to preserve a lifetime record.',
        tags: ['download', 'export', 'save', 'file', 'txt', 'report']
    },
    {
        id: 'fq16', category: 'ai', icon: 'message',
        question: 'How do I chat with Dr. Paws?',
        answer: 'Click the <strong>Chat</strong> tab to open a conversation with <strong>Dr. Paws</strong>, a built-in AI pet care advisor. Dr. Paws knows your pet\'s current stats, personality, and recent activity — and gives warm, personalized advice on how to care for your pet. No API key or setup required.',
        tip: 'Ask Dr. Paws anything about your pet\'s health, happiness, or what to do next!',
        tags: ['chat', 'talk', 'ai', 'dr paws', 'advisor', 'companion', 'conversation', 'message', 'speak', 'how to chat']
    },
    {
        id: 'fq17', category: 'ai', icon: 'lock',
        question: 'Who is Dr. Paws?',
        answer: 'Dr. Paws is your built-in <strong>AI pet care advisor</strong> powered by a fast AI language model. Dr. Paws speaks as a friendly expert — not as your pet — giving specific, actionable advice based on your pet\'s current stats, personality, and care history. No account or setup is needed.',
        tip: 'Dr. Paws is designed to be friendly and easy to understand — perfect for getting quick pet care tips.',
        tags: ['dr paws', 'ai', 'advisor', 'who is', 'companion', 'built-in', 'pet advisor']
    },
    {
        id: 'fq18', category: 'ai', icon: 'clock',
        question: 'Does Dr. Paws remember past conversations?',
        answer: 'Yes! The last <strong>30 messages</strong> are stored and included with every new chat session. Dr. Paws also extracts your interests, hobbies, and personal facts shared in conversation, and references them naturally in future advice.',
        tip: 'Tell Dr. Paws about your hobbies and interests — the advice will feel more personal!',
        tags: ['memory', 'remember', 'history', 'conversation', 'facts', 'context', 'recall', 'dr paws']
    },
    {
        id: 'fq19', category: 'basics', icon: 'list',
        question: 'Are there keyboard shortcuts?',
        answer: '<ul class="faq-ul"><li><kbd>F</kbd> — Feed &nbsp; <kbd>P</kbd> — Play &nbsp; <kbd>S</kbd> — Sleep</li><li><kbd>C</kbd> — Clean &nbsp; <kbd>V</kbd> — Vet visit</li><li><kbd>?</kbd> — Open Help Center</li><li><kbd>Ctrl+S</kbd> — Save game</li><li><kbd>Esc</kbd> — Close panels</li></ul>Shortcuts only work when you\'re not typing in a text field.',
        tags: ['keyboard', 'shortcut', 'hotkey', 'ctrl', 'keys', 'f p s c v shortcut']
    },
    {
        id: 'fq20', category: 'basics', icon: 'reset',
        question: 'How do I start a new game?',
        answer: 'Click the reset button in the top-right corner of the dashboard. A confirmation prompt appears — confirm to erase all current progress and return to the setup wizard.',
        tip: 'This is irreversible! Download any reports you want to keep before resetting.',
        tags: ['reset', 'new game', 'restart', 'delete', 'start over', 'fresh', 'erase']
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// HELP TOPICS  (assistant knowledge base — 12 topics)
// ─────────────────────────────────────────────────────────────────────────────

const HELP_TOPICS = [
    {
        id: 'coins',
        keywords: ['coin', 'earn', 'money', 'income', 'chore', 'reward', 'gold', 'afford', 'buy', 'cost', 'broke', 'poor', 'cash'],
        response: {
            title: 'Earning Coins',
            body: `Go to the <strong>Chores</strong> tab — complete any of the 6 chores to earn coins + pet XP.<br><br>
After each chore a cooldown timer starts; once it resets you can do it again. Do all available chores as soon as they reset.<br><br>
<strong>Action costs for reference:</strong><br>
Feed 15 coins · Play 10 coins · Sleep Free · Clean 12 coins · Vet 35 coins`,
            links: [
                { label: 'How chores work?', q: 'how do chores work' },
                { label: 'Personality coin bonus?', q: 'which personality earns coins' }
            ]
        }
    },
    {
        id: 'stats',
        keywords: ['stat', 'health', 'hunger', 'happiness', 'energy', 'cleanliness', 'bar', 'number', 'degrade', 'decrease', 'drop', 'percentage', 'low', 'how stats'],
        response: {
            title: 'How Stats Work',
            body: `Your pet has <strong>5 stats</strong> (0–100, higher = better) that degrade over time:<br><br>
<strong>Hunger</strong> — Feed to restore (+35 per feed)<br>
<strong>Happiness</strong> — Play to boost (+20 per play)<br>
<strong>Health</strong> — Vet + general care; drops faster when hunger or cleanliness is low<br>
<strong>Energy</strong> — Sleep to restore (+40 per sleep)<br>
<strong>Cleanliness</strong> — Clean to restore (+35 per clean)<br><br>
Below 25, stats trigger warning notifications.`,
            links: [
                { label: 'Pet got sick?', q: 'my pet is sick' },
                { label: 'Action effects?', q: 'what does feeding do' }
            ]
        }
    },
    {
        id: 'leveling',
        keywords: ['level', 'xp', 'experience', 'level up', 'grow', 'rank', 'advance', 'progress', 'next level', 'how many xp', 'how to level'],
        response: {
            title: 'Leveling Up',
            body: `Every action earns your pet XP:<br><br>
Feed: <strong>5 XP</strong> &nbsp;|&nbsp; Play: <strong>8 XP</strong> &nbsp;|&nbsp; Sleep: <strong>3 XP</strong><br>
Clean: <strong>4 XP</strong> &nbsp;|&nbsp; Vet: <strong>10 XP</strong><br><br>
Each level needs <strong>100 XP</strong>. Max level is <strong>10</strong>.<br>
A new trick unlocks at every level — watch the XP bar below your pet!`,
            links: [
                { label: 'Tricks?', q: 'how do tricks work' },
                { label: 'XP bonus personality?', q: 'which personality gives more xp' }
            ]
        }
    },
    {
        id: 'reports',
        keywords: ['report', 'chart', 'graph', 'data', 'trend', 'expense', 'history', 'analytics', 'download', 'export', 'statistics', 'how reports'],
        response: {
            title: 'Reports Center',
            body: `Click the <strong>Reports</strong> tab to access 4 reports:<br><br>
<strong>Expense</strong> — Spending by category + monthly bar chart<br>
<strong>Health</strong> — Health, happiness, hunger trends over time<br>
<strong>Achievement</strong> — Badge/trick progress + level tracker<br>
<strong>Care History</strong> — Action counts + days active<br><br>
Filter by <strong>7 / 30 / 90 days or All Time</strong>. Each report has a <strong>Save</strong> download button.`,
            links: [{ label: 'Download reports?', q: 'how do I download reports' }]
        }
    },
    {
        id: 'sick',
        keywords: ['sick', 'ill', 'disease', 'cure', 'medicine', 'heal', 'sickness', 'infected', 'get sick', 'pet sick'],
        response: {
            title: 'Sick Pet — Act Fast!',
            body: `Your pet is sick — don\'t wait!<br><br>
Click <strong>Vet Visit</strong> (costs 35 coins):<br>
Cures sickness<br>
Restores +30 Health<br>
Boosts +5 Happiness<br><br>
Sickness makes health drop <strong>2× faster</strong>. If you can\'t afford the vet right now, do chores first to earn coins quickly.`,
            links: [
                { label: 'Earn 35 coins fast?', q: 'how do I earn coins' },
                { label: 'How to prevent sickness?', q: 'how to keep pet healthy' }
            ]
        }
    },
    {
        id: 'actions',
        keywords: ['feed', 'play', 'sleep', 'clean', 'vet', 'action', 'button', 'care', 'what does', 'effect', 'result', 'how much does'],
        response: {
            title: 'Care Actions & Effects',
            body: `Here is exactly what each action does:<br><br>
<strong>Feed (15 coins)</strong> → Hunger+35, Happiness+5, Health+2<br>
<strong>Play (10 coins)</strong> → Happiness+20, Energy−15, Hunger−8, Health+3<br>
<strong>Sleep (Free)</strong> → Energy+40, Health+5, Hunger−5<br>
<strong>Clean (12 coins)</strong> → Cleanliness+35, Health+8, Happiness+5<br>
<strong>Vet (35 coins)</strong> → Health+30, Happiness+5, cures sickness`,
            links: [{ label: 'Earn coins?', q: 'how do I earn coins' }]
        }
    },
    {
        id: 'healthy',
        keywords: ['keep healthy', 'prevent', 'maintain', 'tips', 'advice', 'best', 'strategy', 'survive', 'not die', 'good care', 'healthy pet'],
        response: {
            title: 'Keeping Your Pet Healthy',
            body: `Best practices for a thriving pet:<br><br>
1. <strong>Feed before hunger hits 25</strong> — don\'t let it reach 0<br>
2. <strong>Do chores daily</strong> — keeps coins flowing for care<br>
3. <strong>Sleep is free</strong> — use it often to restore energy AND health<br>
4. <strong>Vet proactively</strong> — don\'t wait until health is critical<br>
5. <strong>Clean regularly</strong> — dirty pets get sick more easily`,
            links: [
                { label: 'How stats work?', q: 'how do stats work' },
                { label: 'Pet got sick?', q: 'my pet is sick' }
            ]
        }
    },
    {
        id: 'personality',
        keywords: ['personality', 'friendly', 'energetic', 'shy', 'wise', 'funny', 'trait', 'type', 'bonus', 'which personality', 'best personality', 'personality type'],
        response: {
            title: 'Personality Types',
            body: `Each personality gives a unique permanent bonus:<br><br>
<strong>Friendly</strong> — +15% happiness from play<br>
<strong>Energetic</strong> — +25% XP from play (costs more energy)<br>
<strong>Shy</strong> — +30% energy from sleep<br>
<strong>Wise</strong> — +20% XP from <em>all</em> actions<br>
<strong>Funny</strong> — 15% chance for 5–14 bonus coins per action`,
            links: [{ label: 'Adaptive personality?', q: 'what is adaptive personality' }]
        }
    },
    {
        id: 'adaptive',
        keywords: ['adaptive', 'evolve', 'evolution', 'trait evolve', 'affection', 'talkativeness', 'mood', 'change over time', 'develop', 'timeline', 'adaptive personality'],
        response: {
            title: 'Adaptive Personality Engine',
            body: `Your pet\'s personality traits <strong>evolve based on your weekly behavior</strong>:<br><br>
<strong>Affection</strong> — Grows with frequent feeding<br>
<strong>Energy</strong> — Grows with frequent play<br>
<strong>Talkativeness</strong> — Grows with frequent Dr. Paws chat sessions<br>
<strong>Mood</strong> — Improves with overall good care<br><br>
View current traits and the full evolution history in <strong>Growth → Personality Profile</strong>.`,
            links: [{ label: 'Chat with Dr. Paws?', q: 'how do I chat with dr paws' }]
        }
    },
    {
        id: 'chat',
        keywords: ['chat', 'talk', 'ai companion', 'conversation', 'message', 'speak to', 'how do I talk', 'talk to pet', 'chat with pet', 'dr paws', 'who is dr paws'],
        response: {
            title: 'AI Advisor — Dr. Paws',
            body: `Chat with <strong>Dr. Paws</strong>, your built-in AI pet care advisor — no setup needed!<br><br>
1. Click the <strong>Chat</strong> tab<br>
2. Type your question<br>
3. Dr. Paws responds with advice based on your pet\'s current stats and personality<br><br>
Dr. Paws is a <em>friendly expert advisor</em>, not the pet itself — expect warm care tips and guidance, not pet-speak.`,
            links: [{ label: 'Does Dr. Paws remember me?', q: 'does dr paws remember past conversations' }]
        }
    },
    {
        id: 'apikey',
        keywords: ['api key', 'api', 'key', 'anthropic', 'sk-ant', 'groq', 'get key', 'setup', 'connect', 'where do I get', 'how do I get key', 'no key', 'built-in ai'],
        response: {
            title: 'No API Key Needed',
            body: `The AI advisor (Dr. Paws) is <strong>built right into PetPal AI</strong> — no API key or account required.<br><br>
Just click the <strong>Chat</strong> tab and start typing. Dr. Paws is powered by a fast AI model running in the background.<br><br>
Your chat history and remembered facts are stored <em>only in your browser</em> — never sent to any third party.`,
            links: [{ label: 'How to chat?', q: 'how do I chat with dr paws' }]
        }
    },
    {
        id: 'badges',
        keywords: ['badge', 'achievement', 'medal', 'award', 'collect badges', 'unlock badge', 'milestone', '12 badges', 'trophy', 'how earn badge'],
        response: {
            title: 'Earning Badges',
            body: `There are <strong>12 badges</strong> to collect! Earn them by hitting milestones:<br><br>
• Feed / play / sleep / clean / vet N times<br>
• Reach specific levels (Level 5, Level 10, etc.)<br>
• Maintain high happiness for many ticks<br>
• Complete chores<br>
• Total action milestones<br><br>
View your collection in the <strong>Growth</strong> tab. A popup celebrates each unlock!`,
            links: [{ label: 'How to level up?', q: 'how do I level up' }]
        }
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// HelpCenter class
// ─────────────────────────────────────────────────────────────────────────────

class HelpCenter {
    constructor() {
        this._tab     = 'faq';
        this._cat     = 'all';
        this._query   = '';
        this._greeted = false;

        this._bind();
        this._renderFAQ();
        this._renderQuickChips();
    }

    // ── Public API ───────────────────────────────────────────────────────────

    open(tab = 'faq') {
        const panel   = document.getElementById('helpPanel');
        const overlay = document.getElementById('helpPanelOverlay');
        if (!panel) return;

        panel.style.display   = 'flex';
        overlay.style.display = 'block';
        // force reflow so CSS transition fires
        void panel.offsetWidth;
        panel.classList.add('help-panel-open');
        document.body.classList.add('help-open');

        this._switchTab(tab);

        if (tab === 'assistant' && !this._greeted) this._greetAssistant();

        // Autofocus search or input
        if (tab === 'faq') {
            setTimeout(() => document.getElementById('faqSearchInput')?.focus(), 300);
        } else {
            setTimeout(() => document.getElementById('assistInput')?.focus(), 300);
        }
    }

    close() {
        const panel   = document.getElementById('helpPanel');
        const overlay = document.getElementById('helpPanelOverlay');
        if (!panel) return;

        panel.classList.remove('help-panel-open');
        document.body.classList.remove('help-open');
        setTimeout(() => {
            if (!panel.classList.contains('help-panel-open')) {
                panel.style.display   = 'none';
                overlay.style.display = 'none';
            }
        }, 320);
    }

    isOpen() {
        return document.getElementById('helpPanel')?.classList.contains('help-panel-open') ?? false;
    }

    toggle(tab) { this.isOpen() ? this.close() : this.open(tab); }

    // ── Internal — setup ─────────────────────────────────────────────────────

    _bind() {
        // Close button + overlay backdrop
        document.getElementById('helpPanelClose')?.addEventListener('click',  () => this.close());
        document.getElementById('helpPanelOverlay')?.addEventListener('click', () => this.close());

        // Tab buttons
        document.querySelectorAll('.help-nav-tab').forEach(btn => {
            btn.addEventListener('click', () => this._switchTab(btn.dataset.htab));
        });

        // FAQ search
        const searchInput = document.getElementById('faqSearchInput');
        const searchClear = document.getElementById('faqSearchClear');

        searchInput?.addEventListener('input', () => {
            this._query = searchInput.value;
            if (searchClear) searchClear.style.display = this._query ? 'flex' : 'none';
            this._renderFAQ();
        });

        const clearSearch = () => {
            if (searchInput) searchInput.value = '';
            this._query = '';
            if (searchClear) searchClear.style.display = 'none';
            this._renderFAQ();
        };
        searchClear?.addEventListener('click', clearSearch);
        document.getElementById('faqEmptyClear')?.addEventListener('click', clearSearch);

        // Category pills
        document.querySelectorAll('.faq-cat').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.faq-cat').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this._cat = btn.dataset.cat;
                this._renderFAQ();
            });
        });

        // Assistant send
        document.getElementById('assistSendBtn')?.addEventListener('click', () => this._sendQuestion());
        document.getElementById('assistInput')?.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); this._sendQuestion(); }
        });

        // Global keyboard: ? opens help, Esc closes it
        document.addEventListener('keydown', e => {
            const inField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
            if (e.key === '?' && !inField) this.toggle('faq');
            if (e.key === 'Escape' && this.isOpen()) this.close();
        });

        // Floating FAB — only visible when panel is closed (CSS hides it when open)
        document.getElementById('helpFab')?.addEventListener('click', () => this.open('faq'));
    }

    _switchTab(tab) {
        this._tab = tab;
        document.querySelectorAll('.help-nav-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.htab === tab);
            btn.setAttribute('aria-selected', String(btn.dataset.htab === tab));
        });
        document.querySelectorAll('.help-pane').forEach(p => {
            p.classList.toggle('active', p.id === `${tab}Pane`);
        });

        if (tab === 'assistant' && !this._greeted) this._greetAssistant();
    }

    // ── FAQ rendering ────────────────────────────────────────────────────────

    _renderFAQ() {
        const list  = document.getElementById('faqList');
        const empty = document.getElementById('faqEmpty');
        if (!list) return;

        const q   = this._query.toLowerCase().trim();
        const cat = this._cat;

        const filtered = FAQ_DATA.filter(item => {
            const matchCat = cat === 'all' || item.category === cat;
            if (!matchCat) return false;
            if (!q) return true;
            return item.question.toLowerCase().includes(q) ||
                   item.answer.toLowerCase().includes(q) ||
                   (item.tip || '').toLowerCase().includes(q) ||
                   item.tags.some(t => t.includes(q));
        });

        if (!filtered.length) {
            list.innerHTML = '';
            if (empty) {
                empty.style.display = 'flex';
                const termEl = document.getElementById('faqEmptyTerm');
                if (termEl) termEl.textContent = this._query;
            }
            return;
        }

        if (empty) empty.style.display = 'none';

        // When searching, auto-expand all results so answers are immediately visible
        const forceOpen = q.length > 0;

        list.innerHTML = filtered.map(item => this._faqItemHTML(item, q, forceOpen)).join('');

        // Accordion toggle
        list.querySelectorAll('.faq-item-hdr').forEach(hdr => {
            hdr.addEventListener('click', () => {
                const item = hdr.closest('.faq-item');
                const wasOpen = item.classList.contains('open');
                // Collapse others (single-open accordion when not searching)
                if (!forceOpen) {
                    list.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
                }
                item.classList.toggle('open', !wasOpen);
                hdr.setAttribute('aria-expanded', String(!wasOpen));
            });
        });

        // Related-to follow-up chips inside FAQ items
        list.querySelectorAll('.faq-rel-chip').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                this._switchTab('assistant');
                setTimeout(() => this._askQuestion(btn.dataset.q), 150);
            });
        });
    }

    _faqItemHTML(item, query, open) {
        const q = this._highlight(item.question, query);
        const a = this._highlight(item.answer,   query);
        const t = item.tip ? this._highlight(item.tip, query) : '';

        const relHTML = item.relatedTo
            ? `<div class="faq-related">
                   ${item.relatedTo.map(r =>
                       `<button class="faq-rel-chip" data-q="${this._esc(r.q)}">${r.label}</button>`
                   ).join('')}
               </div>`
            : '';

        return `
            <div class="faq-item${open ? ' open' : ''}" data-id="${item.id}">
                <button class="faq-item-hdr" aria-expanded="${open}">
                    <span class="faq-icon">${typeof Icons !== 'undefined' ? Icons.pixelSvg(item.icon, 18) : ''}</span>
                    <span class="faq-q">${q}</span>
                    <span class="faq-chevron">›</span>
                </button>
                <div class="faq-body">
                    <div class="faq-answer">${a}</div>
                    ${t ? `<div class="faq-tip"><span class="faq-tip-icon">${typeof Icons !== 'undefined' ? Icons.pixelSvg('info', 14) : ''}</span><span>${t}</span></div>` : ''}
                    ${relHTML}
                </div>
            </div>`;
    }

    _highlight(text, query) {
        if (!query) return text;
        const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp(`(${safe})`, 'gi'), '<mark class="hlmark">$1</mark>');
    }

    // ── Assistant ────────────────────────────────────────────────────────────

    _greetAssistant() {
        this._greeted = true;
        this._addBotMsg(
            'PetPal Helper',
            "Hi there! I can answer questions about coins, stats, leveling, reports, the AI companion, and more.<br>Try one of the quick questions below or just type your own!",
            null
        );
    }

    _renderQuickChips() {
        const el = document.getElementById('quickChips');
        if (!el) return;
        const chips = [
            { label: 'How to earn coins?',  q: 'how do I earn coins' },
            { label: 'How do stats work?',  q: 'how do stats work' },
            { label: 'How to level up?',    q: 'how do I level up' },
            { label: 'How do reports work?',q: 'how do reports work' },
            { label: 'My pet got sick?',    q: 'my pet is sick' },
            { label: 'How to earn badges?', q: 'how do I earn badges' },
        ];
        el.innerHTML = chips.map(c =>
            `<button class="quick-chip" data-q="${this._esc(c.q)}">${c.label}</button>`
        ).join('');
        el.querySelectorAll('.quick-chip').forEach(btn => {
            btn.addEventListener('click', () => this._askQuestion(btn.dataset.q));
        });
    }

    _sendQuestion() {
        const input = document.getElementById('assistInput');
        const text  = (input?.value || '').trim();
        if (!text) {
            input?.classList.add('input-shake');
            setTimeout(() => input?.classList.remove('input-shake'), 400);
            return;
        }
        if (input) input.value = '';
        this._askQuestion(text);
    }

    _askQuestion(text) {
        // Dismiss intro UI after first question
        const intro  = document.getElementById('assistIntro');
        const chips  = document.getElementById('quickChips');
        if (intro)  intro.style.display = 'none';
        if (chips) {
            chips.style.transition = 'opacity 0.2s';
            chips.style.opacity    = '0';
            setTimeout(() => { chips.style.display = 'none'; }, 200);
        }

        this._addUserMsg(text);

        // Slight delay so the user message renders before the response
        setTimeout(() => {
            const res = this._matchQuestion(text);
            this._addBotMsg(res.title, res.body, res.links);
        }, 280);
    }

    _addUserMsg(text) {
        const el = document.getElementById('assistMessages');
        if (!el) return;
        const d = document.createElement('div');
        d.className = 'assist-msg user';
        d.innerHTML = `<div class="assist-bubble">${this._esc(text)}</div>`;
        el.appendChild(d);
        el.scrollTop = el.scrollHeight;
    }

    _addBotMsg(title, body, links) {
        const el = document.getElementById('assistMessages');
        if (!el) return;

        const linksHTML = links?.length
            ? `<div class="bot-links">${links.map(l =>
                  `<button class="bot-link" data-q="${this._esc(l.q)}">${l.label}</button>`
              ).join('')}</div>`
            : '';

        const d = document.createElement('div');
        d.className = 'assist-msg bot';
        d.innerHTML = `
            <div class="assist-bot-avatar">${typeof Icons !== 'undefined' ? Icons.pixelSvg('bot', 20) : ''}</div>
            <div class="assist-bubble">
                ${title ? `<div class="bot-title">${title}</div>` : ''}
                <div class="bot-body">${body}</div>
                ${linksHTML}
            </div>`;
        el.appendChild(d);
        el.scrollTop = el.scrollHeight;

        // Bind follow-up chips
        d.querySelectorAll('.bot-link').forEach(btn => {
            btn.addEventListener('click', () => this._askQuestion(btn.dataset.q));
        });
    }

    _matchQuestion(text) {
        const q = text.toLowerCase();
        let best = null, bestScore = 0;

        for (const topic of HELP_TOPICS) {
            let score = 0;
            for (const kw of topic.keywords) {
                if (q.includes(kw)) score += kw.split(' ').length * 2; // multi-word matches score higher
            }
            if (score > bestScore) { bestScore = score; best = topic; }
        }

        if (!best || bestScore === 0) {
            return {
                title: "Hmm, I'm not sure about that one.",
                body: 'Here are some topics I can help with:',
                links: [
                    { label: 'Earning coins',   q: 'how do I earn coins' },
                    { label: 'Pet stats',        q: 'how do stats work' },
                    { label: 'Leveling up',      q: 'how do I level up' },
                    { label: 'Reports',          q: 'how do reports work' },
                    { label: 'Sick pet',         q: 'my pet is sick' },
                    { label: 'AI chat',          q: 'how do I chat with my pet' },
                ]
            };
        }

        return best.response;
    }

    // ── Utility ──────────────────────────────────────────────────────────────

    _esc(str) {
        const d = document.createElement('div');
        d.appendChild(document.createTextNode(String(str)));
        return d.innerHTML;
    }
}
