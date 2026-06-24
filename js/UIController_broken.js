/**
 * VIRTUAL PET SIMULATOR - UI CONTROLLER
 * Manages all user interface updates and interactions
 * 
 * Purpose: Handles all DOM manipulation, event listeners, and UI state
 * Keeps UI logic separate from game logic for better maintainability
 */

class UIController {
    /**
     * Constructor - Initializes UI controller
     * @param {Game} game - Game instance reference
     */
    constructor(game) {
        this.game = game;
        this.elements = {};
        this.updateInterval = null;
        this._cacheElements();
        this._attachEventListeners();
    }

    /**
     * Cache DOM element references for performance
     * @private
     */
    _cacheElements() {
        // Screens
        this.elements.setupScreen = document.getElementById('setupScreen');
        this.elements.gameScreen = document.getElementById('gameScreen');

        // Form
        this.elements.petSetupForm = document.getElementById('petSetupForm');
        this.elements.petName = document.getElementById('petName');
        this.elements.petType = document.getElementById('petType');
        this.elements.difficulty = document.getElementById('difficulty');
        this.elements.initialBudget = document.getElementById('initialBudget');

        // Pet Display
        this.elements.petVisual = document.getElementById('petVisual');
        this.elements.petNameDisplay = document.getElementById('petNameDisplay');
        this.elements.petEmotion = document.getElementById('petEmotion');

        // Stat Bars
        this.elements.hungerBar = document.getElementById('hungerBar');
        this.elements.hungerValue = document.getElementById('hungerValue');
        this.elements.energyBar = document.getElementById('energyBar');
        this.elements.energyValue = document.getElementById('energyValue');
        this.elements.happinessBar = document.getElementById('happinessBar');
        this.elements.happinessValue = document.getElementById('happinessValue');
        this.elements.cleanlinessBar = document.getElementById('cleanlinessBar');
        this.elements.cleanlinessValue = document.getElementById('cleanlinessValue');
        this.elements.healthBar = document.getElementById('healthBar');
        this.elements.healthValue = document.getElementById('healthValue');

        // Action Buttons
        this.elements.feedBtn = document.getElementById('feedBtn');
        this.elements.playBtn = document.getElementById('playBtn');
        this.elements.restBtn = document.getElementById('restBtn');
        this.elements.cleanBtn = document.getElementById('cleanBtn');
        this.elements.healthBtn = document.getElementById('healthBtn');
        this.elements.toyBtn = document.getElementById('toyBtn');

        // Financial Display
        this.elements.currentBudget = document.getElementById('currentBudget');
        this.elements.totalSpent = document.getElementById('totalSpent');
        this.elements.weeklyCosts = document.getElementById('weeklyCosts');

        // Achievements
        this.elements.achievementsList = document.getElementById('achievementsList');

        // Game Controls
        this.elements.saveGameBtn = document.getElementById('saveGameBtn');
        this.elements.resetGameBtn = document.getElementById('resetGameBtn');

        // Help Modal
        this.elements.helpBtn = document.getElementById('helpBtn');
        this.elements.helpModal = document.getElementById('helpModal');
        this.elements.modalCloseButtons = document.querySelectorAll('.modal-close');

        // Feedback Modal
        this.elements.feedbackModal = document.getElementById('feedbackModal');
        this.elements.feedbackContent = document.getElementById('feedbackContent');

        // Warning Modal
        this.elements.warningModal = document.getElementById('warningModal');
        this.elements.warningContent = document.getElementById('warningContent');
        this.elements.warningConfirmBtn = document.getElementById('warningConfirmBtn');
    }

    /**
     * Attach event listeners to interactive elements
     * @private
     */
    _attachEventListeners() {
        // Form submission
        this.elements.petSetupForm.addEventListener('submit', (e) => this._handleFormSubmit(e));

        // Action buttons
        this.elements.feedBtn.addEventListener('click', () => this._performAction('feed'));
        this.elements.playBtn.addEventListener('click', () => this._performAction('play'));
        this.elements.restBtn.addEventListener('click', () => this._performAction('rest'));
        this.elements.cleanBtn.addEventListener('click', () => this._performAction('clean'));
        this.elements.healthBtn.addEventListener('click', () => this._performAction('healthCheck'));
        this.elements.toyBtn.addEventListener('click', () => this._performAction('buyToy'));

        // Game controls
        this.elements.saveGameBtn.addEventListener('click', () => this._saveGame());
        this.elements.resetGameBtn.addEventListener('click', () => this._resetGame());

        // Help modal
        this.elements.helpBtn.addEventListener('click', () => this._openModal(this.elements.helpModal));
        this.elements.modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this._closeModal(e));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this._handleKeyboard(e));

        // Footer help links
        document.getElementById('footerHelpLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this._openModal(this.elements.helpModal);
        });
    }

    /**
     * Handle form submission
     * @private
     */
    _handleFormSubmit(event) {
        event.preventDefault();

        const petName = this.elements.petName.value.trim();
        const petType = this.elements.petType.value;
        const difficulty = this.elements.difficulty.value;
        const initialBudget = parseInt(this.elements.initialBudget.value);

        // Validate form
        if (!this._validateForm(petName, petType, difficulty, initialBudget)) {
            return;
        }

        // Initialize game
        if (this.game.initializeGame(petName, petType, initialBudget, difficulty)) {
            this._switchToGameScreen();
            this._startGameLoop();
            this._updateAllUI();
        } else {
            this._showWarning('Error initializing game. Please try again.');
        }
    }

    /**
     * Validate form inputs
     * @private
     */
    _validateForm(petName, petType, difficulty, budget) {
        if (!petName || petName.length < 2 || petName.length > 20) {
            this._showWarning('Pet name must be 2-20 characters');
            return false;
        }

        if (!petType) {
            this._showWarning('Please select a pet type');
            return false;
        }

        if (!difficulty) {
            this._showWarning('Please select difficulty level');
            return false;
        }

        if (budget < 100 || budget > 2000) {
            this._showWarning('Budget must be between $100 and $2000');
            return false;
        }

        return true;
    }

    /**
     * Switch to game screen
     * @private
     */
    _switchToGameScreen() {
        this.elements.setupScreen.classList.remove('active');
        this.elements.gameScreen.classList.add('active');
    }

    /**
     * Switch back to setup screen
     * @private
     */
    _switchToSetupScreen() {
        this.elements.gameScreen.classList.remove('active');
        this.elements.setupScreen.classList.add('active');
        this.elements.petSetupForm.reset();
    }

    /**
     * Perform a pet care action
     * @private
     */
    _performAction(action) {
        if (!this.game.isRunning) return;

        // Disable button temporarily
        const button = this._getButtonForAction(action);
        const originalText = button.innerHTML;
        button.disabled = true;

        // Perform action
        const result = this.game.performAction(action);

        // Show feedback
        if (result.success) {
            this._showFeedback(result, 'success');
            button.classList.add('animate-bounce');
            setTimeout(() => button.classList.remove('animate-bounce'), 600);
        } else {
            this._showFeedback(result, 'error');
            button.classList.add('animate-shake');
            setTimeout(() => button.classList.remove('animate-shake'), 500);
        }

        // Show warning if present
        if (result.warning) {
            this._showWarning(result.warning);
        }

        // Re-enable button after delay
        setTimeout(() => {
            button.disabled = false;
        }, 500);

        // Update UI
        this._updateAllUI();
    }

    /**
     * Get button element for action
     * @private
     */
    _getButtonForAction(action) {
        const buttonMap = {
            feed: this.elements.feedBtn,
            play: this.elements.playBtn,
            rest: this.elements.restBtn,
            clean: this.elements.cleanBtn,
            healthCheck: this.elements.healthBtn,
            buyToy: this.elements.toyBtn
        };
        return buttonMap[action];
    }

    /**
     * Show action feedback
     * @private
     */
    _showFeedback(result, type = 'success') {
        const messages = MESSAGES.actions[result.action]?.[type] || [result.message];
        const message = messages[Math.floor(Math.random() * messages.length)];

        this.elements.feedbackContent.innerHTML = `
            <div class="feedback-emoji">${type === 'success' ? '✅' : '❌'}</div>
            <p>${message}</p>
        `;

        this._openModal(this.elements.feedbackModal);

        // Auto-close after 2 seconds
        setTimeout(() => this._closeModalAuto(this.elements.feedbackModal), 2000);
    }

    /**
     * Show warning modal
     * @private
     */
    _showWarning(message) {
        this.elements.warningContent.innerHTML = `<p>${message}</p>`;
        this._openModal(this.elements.warningModal);

        const btn = this.elements.warningConfirmBtn;
        btn.onclick = () => this._closeModal(new Event('click'), this.elements.warningModal);
    }

    /**
     * Update all UI elements
     * @private
     */
    _updateAllUI() {
        if (!this.game.pet) return;

        this._updatePetDisplay();
        this._updateStatBars();
        this._updateFinancials();
        this._updateAchievements();
    }

    /**
     * Update pet display (name, emoji, emotion)
     * @private
     */
    _updatePetDisplay() {
        const pet = this.game.pet;
        const petType = PET_TYPES[pet.type];

        // Update visual
        this.elements.petVisual.textContent = petType.emoji;
        this.elements.petVisual.className = 'pet-visual animate-float';

        // Apply emotion animation
        const emotion = pet.getEmotion();
        const emotionClass = `pet-emotion-${emotion.label.toLowerCase()}`;
        this.elements.petVisual.className = `pet-visual ${emotionClass}`;

        // Update name
        this.elements.petNameDisplay.textContent = pet.name;

        // Update emotion
        this.elements.petEmotion.innerHTML = `
            <span title="${emotion.label}">${emotion.emoji}</span>
        `;
    }

    /**
     * Update stat bars and values
     * @private
     */
    _updateStatBars() {
        const stats = this.game.pet.getStats();

        // Helper function to update stat
        const updateStat = (bar, value, display) => {
            bar.style.width = `${value}%`;
            display.textContent = `${Math.round(value)}%`;
            
            // Apply color coding
            if (value < 20) bar.parentElement.parentElement.style.opacity = '0.6';
            else bar.parentElement.parentElement.style.opacity = '1';
        };

        updateStat(this.elements.hungerBar, stats.hunger, this.elements.hungerValue);
        updateStat(this.elements.energyBar, stats.energy, this.elements.energyValue);
        updateStat(this.elements.happinessBar, stats.happiness, this.elements.happinessValue);
        updateStat(this.elements.cleanlinessBar, stats.cleanliness, this.elements.cleanlinessValue);
        updateStat(this.elements.healthBar, stats.health, this.elements.healthValue);
    }

    /**
     * Update financial display
     * @private
     */
    _updateFinancials() {
        const game = this.game;

        this.elements.currentBudget.textContent = `$${game.currentBudget.toFixed(2)}`;
        this.elements.totalSpent.textContent = `$${game.totalSpent.toFixed(2)}`;

        // Update weekly costs
        const weeklyCosts = game.getWeeklyCosts();
        this.elements.weeklyCosts.textContent = `$${weeklyCosts.totalWeekly.toFixed(2)}`;

        // Color code budget warning
        const budgetPercentage = (game.currentBudget / game.initialBudget) * 100;
        if (budgetPercentage < 20) {
            this.elements.currentBudget.parentElement.style.color = '#ef4444';
        } else {
            this.elements.currentBudget.parentElement.style.color = '#6366f1';
        }
    }

    /**
     * Update achievements display
     * @private
     */
    _updateAchievements() {
        const achievementsList = this.elements.achievementsList;
        achievementsList.innerHTML = '';

        if (this.game.unlockedAchievements.length === 0) {
            achievementsList.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No achievements yet. Keep caring for your pet!</p>';
            return;
        }

        this.game.unlockedAchievements.forEach(achievement => {
            const achievementEl = document.createElement('div');
            achievementEl.className = 'achievement-item';
            achievementEl.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            `;
            achievementsList.appendChild(achievementEl);
        });
    }

    /**
     * Start the main game loop
     * @private
     */
    _startGameLoop() {
        this.updateInterval = setInterval(() => {
            if (!this.game.isRunning) return;

            // Update game state
            const updateReport = this.game.update();

            // Handle game over
            if (updateReport.gameOverReason) {
                this._handleGameOver(updateReport.gameOverReason);
                return;
            }

            // Show new achievements
            updateReport.achievementUnlocks.forEach(achievement => {
                this._showAchievementNotification(achievement);
            });

            // Update UI
            this._updateAllUI();
        }, GAME_CONFIG.UPDATE_INTERVAL);
    }

    /**
     * Stop the game loop
     * @private
     */
    _stopGameLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Handle game over
     * @private
     */
    _handleGameOver(reason) {
        this._stopGameLoop();
        this.game.isRunning = false;

        const result = this.game.endGame(reason);

        const stats = result.stats;
        const message = `
            ${result.message}
            
            <strong>Final Stats:</strong>
            Pet: ${stats.petName}
            Days Cared: ${stats.daysCared}
            Actions: ${stats.actionsPerformed}
            Spent: $${stats.totalSpent}
            Achievements: ${stats.achievementsUnlocked}
        `;

        this._showWarning(message);

        // After warning, offer restart
        setTimeout(() => {
            if (confirm('Would you like to start a new game?')) {
                this._resetGame();
            }
        }, 1000);
    }

    /**
     * Show achievement notification
     * @private
     */
    _showAchievementNotification(achievement) {
        console.log(`🏆 ${achievement.title}: ${achievement.description}`);
        
        // Visual feedback can be added here
        const notification = document.createElement('div');
        notification.className = 'achievement-notification achievement-unlock';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div>${achievement.title}</div>
        `;
        // Would be added to a notification container
    }

    /**
     * Save game
     * @private
     */
    _saveGame() {
        if (this.game.saveGame()) {
            this._showFeedback({ action: 'save', message: 'Game saved successfully!' }, 'success');
        } else {
            this._showWarning('Error saving game');
        }
    }

    /**
     * Reset game (start new)
     * @private
     */
    _resetGame() {
        if (confirm('Are you sure you want to start a new game? Current progress will be lost.')) {
            this._stopGameLoop();
            this.game.reset();
            this._switchToSetupScreen();
        }
    }

    /**
     * Open modal
     * @private
     */
    _openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     * @private
     */
    _closeModal(event, modal = null) {
        const targetModal = modal || event.target.closest('.modal');
        targetModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    /**
     * Close modal automatically
     * @private
     */
    _closeModalAuto(modal) {
        modal.classList.remove('active');
    }

    /**
     * Handle keyboard shortcuts
     * @private
     */
    _handleKeyboard(event) {
        if (!this.game.isRunning) return;

        switch (event.key.toLowerCase()) {
            case 'f':
                this._performAction('feed');
                break;
            case 'p':
                this._performAction('play');
                break;
            case 'r':
                this._performAction('rest');
                break;
            case 'c':
                this._performAction('clean');
                break;
            case 'h':
                this._performAction('healthCheck');
                break;
            case 't':
                this._performAction('buyToy');
                break;
            case '?':
                this._openModal(this.elements.helpModal);
                break;
            case 's':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this._saveGame();
                }
                break;
            case 'escape':
                const openModals = document.querySelectorAll('.modal.active');
                openModals.forEach(modal => this._closeModal(null, modal));
                break;
        }
    }
}

// ========== Export ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}
