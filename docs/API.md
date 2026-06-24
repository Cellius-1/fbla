# API Documentation

## Table of Contents

1. [Pet Class API](#pet-class-api)
2. [Game Class API](#game-class-api)
3. [UIController Class API](#uicontroller-class-api)
4. [StorageManager Class API](#storagemanager-class-api)
5. [Constants Reference](#constants-reference)
6. [Type Definitions](#type-definitions)

---

## Pet Class API

### Constructor

```javascript
/**
 * Create a new pet instance
 * @param {string} name - Pet's name (2-20 characters)
 * @param {string} type - Pet type ('dog', 'cat', 'rabbit', 'hamster', 'bird')
 */
const pet = new Pet('Buddy', 'dog');
```

### Properties

**Stats** (0-100):
- `hunger` - How hungry the pet is (higher = hungrier)
- `energy` - Pet's energy level
- `happiness` - Pet's happiness level
- `cleanliness` - Pet's hygiene level
- `health` - Pet's overall health

**Information**:
- `name` - Pet's name
- `type` - Pet type
- `createdAt` - Timestamp of pet creation
- `isSick` - Boolean indicating sickness

**Tracking**:
- `actionsPerformed` - Total actions done
- `feedCount` - Times fed
- `playCount` - Times played with
- `healthChecks` - Health check count

### Methods

#### `getEmotion()`

```javascript
const emotion = pet.getEmotion();
// Returns: { emoji: '😊', label: 'Happy' }
```

**Logic**:
- Returns emotion based on current stats
- Checks health first (sickness = sick emoji)
- Then energy, hunger, happiness in order
- Falls back to neutral

**Possible Returns**:
- `{ emoji: '🤒', label: 'Sick' }`
- `{ emoji: '😴', label: 'Sleepy' }`
- `{ emoji: '😤', label: 'Angry' }`
- `{ emoji: '😢', label: 'Sad' }`
- `{ emoji: '😊', label: 'Happy' }`

#### `getWellnessState()`

```javascript
const wellness = pet.getWellnessState();
// Returns: { threshold: 40, emoji: '🤒' }
```

**States**:
- `sick`: average health < 40
- `weak`: average health < 50
- `normal`: average health < 70
- `healthy`: average health < 90
- `excellent`: average health >= 90

#### `updateStats()`

```javascript
const changes = pet.updateStats();
// Returns: { decreased: [...], increased: [...], warnings: [...] }
```

**Behavior**:
- Degrades all stats by configured amounts
- Applies sickness damage if sick
- Checks for new sickness onset
- Generates warnings for critical stats

**Returned Warnings**:
- `'hungry'` - Hunger > 85%
- `'tired'` - Energy < 20%
- `'sad'` - Happiness < 30%
- `'dirty'` - Cleanliness < 30%
- `'sick'` - Pet is sick

#### `performAction(action)`

```javascript
const result = pet.performAction('feed');
// Returns: { success: true, message: 'Successfully performed feed!' }
```

**Parameters**:
- `'feed'` - Reduce hunger, improve health
- `'play'` - Increase happiness, drain energy
- `'rest'` - Restore energy and health
- `'clean'` - Improve cleanliness, prevent illness
- `'healthCheck'` - Monitor/treat health
- `'buyToy'` - Increase happiness

**Return Format**:
```javascript
{
  success: boolean,
  message: string
}
```

#### `makeSick()` / `treatSickness()`

```javascript
pet.makeSick();           // Force sickness
const treated = pet.treatSickness();  // Treat if possible
```

#### `timeSinceAction(action)`

```javascript
const minutes = pet.timeSinceAction('feed');
// Returns: number of minutes since action
```

#### `getStats()`

```javascript
const stats = pet.getStats();
// Returns: { hunger: 75, energy: 50, happiness: 80, cleanliness: 60, health: 85 }
```

#### `getStatus()`

```javascript
const status = pet.getStatus();
// Returns: formatted string with pet info
```

#### `toJSON()` / `fromJSON()`

```javascript
// Serialize for storage
const json = pet.toJSON();

// Restore from storage
const restoredPet = Pet.fromJSON(json);
```

---

## Game Class API

### Constructor

```javascript
const game = new Game();
```

### Properties

**Game State**:
- `pet` - Pet instance
- `isRunning` - Game active state
- `isPaused` - Game paused state

**Financial**:
- `currentBudget` - Available funds
- `initialBudget` - Starting funds
- `totalSpent` - Total expenses
- `difficulty` - 'easy', 'medium', or 'hard'
- `expenseMultiplier` - Cost multiplier

**Session**:
- `sessionStartTime` - Game start timestamp
- `updateInterval` - Game loop interval

**Collections**:
- `unlockedAchievements` - Array of achievements
- `storage` - StorageManager instance

### Methods

#### `initializeGame(name, type, budget, difficulty)`

```javascript
const success = game.initializeGame('Buddy', 'dog', 500, 'medium');
// Returns: boolean
```

**Validation**:
- Pet name: 2-20 characters
- Pet type: Valid type from PET_TYPES
- Budget: 100-2000
- Difficulty: 'easy', 'medium', or 'hard'

#### `performAction(action)`

```javascript
const result = game.performAction('feed');
```

**Return Format**:
```javascript
{
  success: boolean,
  message: string,
  affordability: boolean,    // Can afford action?
  warning: string            // Optional warning
}
```

**Costs** (adjusted by difficulty):
- feed: $5
- play: $3
- rest: $0
- clean: $4
- healthCheck: $10
- buyToy: $8

#### `update()`

```javascript
const report = game.update();
```

**Return Format**:
```javascript
{
  petUpdates: {...},
  achievementUnlocks: [...],
  warningsTriggered: [...],
  gameOverReason: null or string
}
```

**Game Over Reasons**:
- `'noBudget'` - Budget reached $0
- `'petDied'` - Health reached 0%
- `'petLost'` - Happiness reached 0%

#### `checkAchievements()`

```javascript
const newAchievements = game.checkAchievements();
// Returns: array of newly unlocked achievements
```

#### `endGame(reason)`

```javascript
const result = game.endGame('noBudget');
```

**Return Format**:
```javascript
{
  reason: string,
  message: string,
  stats: {
    petName: string,
    daysCared: number,
    actionsPerformed: number,
    totalSpent: number,
    budgetRemaining: number,
    achievementsUnlocked: number
  }
}
```

#### `getGameStats()`

```javascript
const stats = game.getGameStats();
```

**Return Structure**:
```javascript
{
  petStats: {...},
  petInfo: {...},
  financials: {
    initialBudget: number,
    currentBudget: number,
    totalSpent: number,
    budgetUsedPercentage: string,
    difficulty: string
  },
  progress: {
    actionsPerformed: number,
    feedCount: number,
    playCount: number,
    daysCared: number,
    toysPurchased: number,
    healthChecks: number,
    illnessCount: number
  },
  achievements: {
    unlocked: array,
    count: number,
    totalAvailable: number
  }
}
```

#### `getWeeklyCosts()`

```javascript
const costs = game.getWeeklyCosts();
```

**Return Format**:
```javascript
{
  totalWeeklyCost: number,
  costByAction: {
    feed: number,
    play: number,
    clean: number,
    healthCheck: number,
    buyToy: number
  },
  averageDailyCost: string,
  expenseCount: number
}
```

#### `saveGame()` / `loadGame()` / `reset()`

```javascript
game.saveGame();      // Save to localStorage
game.loadGame();      // Load from localStorage
game.reset();         // Clear all data
```

---

## UIController Class API

### Constructor

```javascript
const ui = new UIController(game);
```

### Methods

#### `_performAction(action)`

```javascript
ui._performAction('feed');
```

**Process**:
1. Validates game is running
2. Disables button temporarily
3. Calls `game.performAction()`
4. Shows feedback modal
5. Animates button
6. Updates all UI

#### `_updateAllUI()`

```javascript
ui._updateAllUI();
```

**Updates**:
- Pet display
- Stat bars
- Financial information
- Achievements list

#### `_updateStatBars()`

```javascript
ui._updateStatBars();
```

Updates all stat bar widths and values.

#### `_updateFinancials()`

```javascript
ui._updateFinancials();
```

Updates budget, spent, and weekly cost displays.

#### `_showFeedback(result, type)`

```javascript
ui._showFeedback({ action: 'feed', message: 'Fed!' }, 'success');
```

**Types**:
- `'success'` - Green feedback
- `'error'` - Red feedback

#### `_showWarning(message)`

```javascript
ui._showWarning('Budget running low!');
```

Shows warning modal with message.

#### `_openModal(modal)` / `_closeModal(event, modal)`

```javascript
ui._openModal(this.elements.helpModal);
ui._closeModal(event);
```

#### `_handleKeyboard(event)`

```javascript
// Automatically called on keydown
// Supports shortcuts:
// F, P, R, C, H, T, ?, Ctrl+S, Esc
```

#### `_saveGame()` / `_resetGame()`

```javascript
ui._saveGame();    // Save game
ui._resetGame();   // Start over
```

---

## StorageManager Class API

### Constructor

```javascript
const storage = new StorageManager();
```

### Methods

#### `saveGame(gameData)` / `loadGame()`

```javascript
storage.saveGame(gameData);
const data = storage.loadGame();
```

#### `savePet(pet)` / `loadPet()`

```javascript
storage.savePet(pet);
const pet = storage.loadPet();
```

#### `saveExpense(expense)` / `loadExpenses()`

```javascript
storage.saveExpense({ action: 'feed', cost: 5 });
const expenses = storage.loadExpenses();
```

**Expense Format**:
```javascript
{
  timestamp: number,
  action: string,
  cost: number,
  budgetRemaining: number
}
```

#### `saveAchievements(achievements)` / `loadAchievements()`

```javascript
storage.saveAchievements(achievements);
const achievements = storage.loadAchievements();
```

#### `exportData()` / `importData(jsonString)`

```javascript
const json = storage.exportData();    // Export all data
storage.importData(json);             // Import all data
```

#### `hasSavedGame()`

```javascript
if (storage.hasSavedGame()) {
  // Load game
}
```

#### `deleteGame()`

```javascript
storage.deleteGame();  // Clear all storage
```

#### `getStorageStats()`

```javascript
const stats = storage.getStorageStats();
// Returns: { totalSize, entries, breakdown }
```

#### `clearOldData(daysToKeep)`

```javascript
const removed = storage.clearOldData(30);
// Removes data older than 30 days
```

---

## Constants Reference

### GAME_CONFIG

```javascript
GAME_CONFIG = {
  UPDATE_INTERVAL: 5000,           // 5 seconds
  STAT_DEGRADATION: {
    hunger: 1.5,
    energy: 1,
    happiness: 0.8,
    cleanliness: 1.2,
    health: 0.3
  },
  DIFFICULTY_MULTIPLIERS: {
    easy: 0.7,
    medium: 1.0,
    hard: 1.5
  }
}
```

### PET_TYPES

```javascript
PET_TYPES = {
  dog: { emoji: '🐕', displayName: 'Dog', ... },
  cat: { emoji: '🐱', displayName: 'Cat', ... },
  // ... others
}
```

### ACTION_COSTS

```javascript
ACTION_COSTS = {
  feed: 5,
  play: 3,
  rest: 0,
  clean: 4,
  healthCheck: 10,
  buyToy: 8
}
```

### ACTION_EFFECTS

```javascript
ACTION_EFFECTS = {
  feed: { hunger: -30, happiness: 2, ... },
  play: { happiness: 15, energy: -10, ... },
  // ... others
}
```

### ACHIEVEMENTS

```javascript
ACHIEVEMENTS = {
  GREAT_PARENT: {
    id: 'great_parent',
    title: '🏆 Great Parent',
    description: 'Maintain all stats above 80%',
    condition: (pet) => { ... }
  },
  // ... others
}
```

---

## Type Definitions

### Emotion

```javascript
{
  emoji: string,     // Unicode emoji
  label: string      // 'Happy', 'Sad', etc.
}
```

### Pet Stats

```javascript
{
  hunger: number,        // 0-100
  energy: number,        // 0-100
  happiness: number,     // 0-100
  cleanliness: number,   // 0-100
  health: number         // 0-100
}
```

### Action Result

```javascript
{
  success: boolean,
  message: string,
  affordability?: boolean,
  warning?: string
}
```

### Achievement

```javascript
{
  id: string,
  title: string,
  description: string,
  icon: string,
  condition: function
}
```

### Game Stats

```javascript
{
  petStats: Object,
  petInfo: Object,
  financials: Object,
  progress: Object,
  sessionInfo: Object,
  achievements: Object
}
```

---

**API Version**: 1.0  
**Last Updated**: May 2026  
