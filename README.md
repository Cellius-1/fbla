# PetPal AI — FBLA Introduction to Programming 2025-2026

**Developer:** Tharun Naguleswaran
**Event:** Introduction to Programming
**Technologies:** HTML5, CSS3, Vanilla JavaScript (ES6+), Chart.js, Groq API

---

## 2025-2026 Topic Correlation

**Topic:** *Build a Virtual Pet* — Create a digital pet that users can name, feed, and care for over time. The pet should respond to how well it is treated, showing emotions, changing appearance or behavior, and developing based on the user's actions. Include a "cost of care" system to teach users about the financial responsibility of pet ownership.

The table below maps every requirement  to the specific feature in PetPal AI that addresses it.

| Topic Requirement | How PetPal  Addresses It |
|---|---|
| User names the pet, chooses type | 3-step setup wizard — name (validated), pet type (Dog/Cat/Rabbit/Bird), color, and personality |
| Feed, play, rest, clean, health check | Five care actions: Feed, Play, Sleep, Clean, Vet — each with real coin costs and stat effects |
| Reactions based on care level | 8 distinct emotions (ecstatic, happy, neutral, sad, hungry, tired, sick, dirty) driven live by stat values |
| Changing appearance or behavior | Pixel sprite renderer updates the pet's displayed frame based on current emotion and action state |
| Developing based on user's actions | XP and leveling system (10 levels); personality traits shift over time based on how often the user feeds vs. plays |
| Food and supply costs | Feed costs 15 coins, Play costs 10 coins, Clean costs 12 coins |
| Vet visits or health care | Vet costs 35 coins; sickness mechanic forces urgent vet visits |
| Budget limits or in-game currency | Coin system with a starting balance; actions are disabled when the player cannot afford them |
| Running total of care-related expenses | Finance tab shows total spent, spending by category, daily average, and monthly bar chart |
| Optional — earning system | 6 chores (Wash Dishes, Clean Room, Water Plants, etc.) earn coins and XP on a cooldown timer |
| Optional — learn tricks | 9 tricks unlock automatically as the pet reaches each level milestone |
| Optional — earn badges | 12 badges unlock when specific milestones are reached (e.g. 10 feeds, happy streak, max level) |

---

## How to Run

1. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
2. No installation or internet connection required for core gameplay
3. Complete the 3-step setup wizard to create your pet
4. Use the tabs (Care, Finance, Growth, Chores, History, Memories, Chat, Reports) to manage and analyze your pet

---

## How to Use

### Setup Wizard
- **Step 1** — Choose a pet type (Dog, Cat, Rabbit, or Bird)
- **Step 2** — Choose a color and personality (each personality has a unique gameplay effect)
- **Step 3** — Name your pet (2–20 characters, letters/numbers/hyphens/apostrophes only)

### Care Actions
| Action | Cost | Primary Effect |
|---|---|---|
| Feed | 15 coins | Restores hunger; small happiness and health boost |
| Play | 10 coins | Raises happiness; costs energy and hunger |
| Sleep | Free | Restores energy; small health boost |
| Clean | 12 coins | Restores cleanliness; health and happiness boost |
| Vet | 35 coins | Restores health; cures sickness |

### Keyboard Shortcuts
| Key | Action |
|---|---|
| F | Feed |
| P | Play |
| S | Sleep |
| C | Clean |
| V | Vet |
| Ctrl+S | Save game |
| ? | Open help |

### Tabs
- **Care** — Main dashboard with pet stats and action buttons
- **Finance** — Spending breakdown by category and transaction history
- **Growth** — XP progress, badges, tricks, and personality traits
- **Chores** — Earn coins and XP by completing timed chores
- **History** — Timestamped activity log
- **Memories** — Auto-recorded scrapbook of milestone moments
- **Chat** — AI advisor (Dr. Paws) powered by Groq — requires a free Groq API key
- **Reports** — Chart.js analytics with date range filter and downloadable reports

### Reports
Four report types are available, each with a date range filter (7 / 30 / 90 days / All Time) and a Save button that downloads a formatted `.txt` file:
- **Expense Report** — spending by category (doughnut chart) and monthly totals (bar chart)
- **Health Report** — line chart of all 5 stats over time; toggle individual stats on/off
- **Achievement Report** — badge and trick progress (stacked bar); XP earned in the selected period
- **Care History Report** — count of each care action performed in the selected period

---

## Project Structure

```
fbla/
├── index.html               Main application (single-page)
├── css/
│   ├── styles.css           Main stylesheet
│   └── animations.css       Keyframe animations
├── js/
│   ├── constants.js         All game config, costs, effects, badge/trick/chore definitions
│   ├── icons.js             Pixel SVG icon library
│   ├── PixelSprites.js      Animated pixel art pet renderer
│   ├── Validator.js         Centralized input validation (syntactical + semantic)
│   ├── Pet.js               Pet model — stats, XP, leveling, tick decay
│   ├── StorageManager.js    localStorage persistence (game, expenses, income)
│   ├── Game.js              Game coordinator — actions, chores, badges, save/load
│   ├── AICompanion.js       Groq streaming chat integration
│   ├── PersonalityEngine.js Adaptive personality trait system
│   ├── Scrapbook.js         Auto-recorded milestone memory journal
│   ├── ReportsCenter.js     Chart.js analytics with date filtering and downloads
│   ├── HelpCenter.js        Searchable FAQ with 20+ entries
│   ├── UIController.js      All DOM interaction and game loop
│   └── main.js              Application entry point
├── docs/                    Additional technical documentation
├── README.md                This file
└── RESOURCES.md             Libraries and attribution
```

---

## Additional Features 

| Feature | Description |
|---|---|
| Personality Engine | Each personality (Friendly, Energetic, Shy, Wise, Funny) permanently changes how stats are affected, creating different gameplay strategies |
| Sickness mechanic | 3% random chance of illness when health drops below 40; sick pets decay faster and are restricted to vet/sleep only |
| Memory Scrapbook | Automatically records milestone moments (level-ups, badges, days together, spending milestones) as journal entries |
| AI Chat (Dr. Paws) | Groq-powered streaming chat advisor that gives context-aware advice based on the pet's current stats |
| Stat toggle reports | Health report lets the user show/hide individual stat lines on the chart |
| Downloadable reports | All four reports export formatted `.txt` files |

---

## Browser Compatibility

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Credits and Attribution

See `RESOURCES.md` for the complete list of external libraries and resources used.
