# PetPal AI — Resources & Attribution

**FBLA Introduction to Programming 2025-2026**
**Developer:** Tharun Naguleswaran

---

## External Libraries & APIs

These are the only external dependencies loaded by the project. All other code is original.

| Resource | Version / Model | Source | Purpose | License |
|---|---|---|---|---|
| Chart.js | v4.4.4 | cdn.jsdelivr.net | Renders all charts in the Reports tab (line, bar, doughnut) | MIT |
| Press Start 2P | — | Google Fonts (fonts.googleapis.com) | Pixel-style heading and UI font | OFL (SIL Open Font License) |
| Pixelify Sans | 400–700 | Google Fonts (fonts.googleapis.com) | Secondary pixel display font | OFL (SIL Open Font License) |
| Groq API | llama-3.1-8b-instant | api.groq.com | Powers the Dr. Paws AI chat advisor in the Chat tab | Groq Terms of Service |

### Chart.js
- **URL:** https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js
- **License:** MIT — https://github.com/chartjs/Chart.js/blob/master/LICENSE.md
- **Usage:** All four report charts — expense doughnut, monthly bar, health line chart, achievement stacked bar, and care history bar

### Press Start 2P
- **URL:** https://fonts.google.com/specimen/Press+Start+2P
- **Designer:** CodeMan38
- **License:** SIL Open Font License 1.1
- **Usage:** Primary display font throughout the UI (`--font-pixel` CSS variable)

### Pixelify Sans
- **URL:** https://fonts.google.com/specimen/Pixelify+Sans
- **Designer:** Stefie Justprince
- **License:** SIL Open Font License 1.1
- **Usage:** Secondary pixel font for body text and labels

### Groq API
- **Endpoint:** https://api.groq.com/openai/v1/chat/completions
- **Model:** llama-3.1-8b-instant (Meta, open weights)
- **Terms:** https://groq.com/terms-of-service/
- **Usage:** Streaming AI chat responses for the Dr. Paws advisor in the Chat tab. Requires a free user-supplied API key — no key is bundled with the project.

---

## Code

| File | Description |
|---|---|
| `js/constants.js` | All game configuration, costs, stat definitions, badge/trick/chore data |
| `js/icons.js` | Custom pixel SVG icon library (all icons hand-authored) |
| `js/PixelSprites.js` | Animated pixel art pet renderer using the HTML5 Canvas API |
| `js/Validator.js` | Centralized input validation (syntactical and semantic) |
| `js/Pet.js` | Pet model — stats, XP, leveling, tick decay, personality effects |
| `js/StorageManager.js` | localStorage persistence layer for game state, expenses, and income |
| `js/Game.js` | Game coordinator — actions, chores, badges, save/load |
| `js/AICompanion.js` | Groq API integration with streaming response handling |
| `js/PersonalityEngine.js` | Adaptive personality trait system |
| `js/Scrapbook.js` | Auto-recorded milestone memory journal |
| `js/ReportsCenter.js` | Chart.js analytics with date filtering and downloadable reports |
| `js/HelpCenter.js` | Searchable in-game FAQ |
| `js/UIController.js` | All DOM interaction, game loop, and tab management |
| `js/main.js` | Application entry point |
| `css/styles.css` | Main stylesheet |
| `css/animations.css` | Keyframe animations |
| `index.html` | Single-page application structure |

---

## Game Concept Inspiration

The gameplay mechanics were inspired by established virtual pet games. No code or assets were taken from any of these sources — only the general concept of stat-based pet care.

| Inspiration | What Was Referenced |
|---|---|
| Tamagotchi (Bandai, 1996) | Core concept of time based stat decay and care actions |
| Neopets (1999) | In-game currency and financial management mechanics |
| Pokémon series (Nintendo/Game Freak) | Emotion and personality systems |

---

## Development Tools

These tools were used during development but are not part of the submitted project.

| Tool | Purpose |
|---|---|
| Visual Studio Code | Code editor |
| Google Chrome DevTools | Debugging and testing |
| Git / GitHub | Version control |
| MDN Web Docs (developer.mozilla.org) | JavaScript and Web API reference |

---

## Web Standards Referenced

- **HTML5** — https://html.spec.whatwg.org/
- **CSS3 / CSS Custom Properties** — https://www.w3.org/Style/CSS/
- **ES6+ JavaScript** — https://www.ecma-international.org/
- **Web Storage API (localStorage)** — https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Canvas API** — https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- **Fetch API** — https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **ARIA / Accessibility** — https://www.w3.org/WAI/ARIA/apg/

---

*Created for FBLA Introduction to Programming 2025-2026*
