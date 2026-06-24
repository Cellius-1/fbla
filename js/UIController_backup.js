/**
 * PETCARE PRO - UI CONTROLLER
 * Manages all user interface and DOM interactions
 */

class UIController {
    constructor(game) {
        this.game = game;
        this.isGameRunning = false;
        this.gameLoopInterval = null;
        this.elements = {};
        this._cacheElements();
        this._attachEventListeners();
    }

    /**
     * Cache frequently accessed DOM elements
     * @private
     */
    _cacheElements() {
        try {
            // Screens
            this.elements.setupScreen = document.getElementById('setupScreen');
            this.elements.gameScreen = document.getElementById('gameScreen');

            // Form elements
            this.elements.petSetupForm = document.getElementById('petSetupForm');
            this.elements.petName = document.getElementById('petName');
            this.elements.petType = document.getElementById('petType');
            this.elements.difficulty = document.getElementById('difficulty');
            this.elements.initialBudget = document.getElementById('initialBudget');

            // Game display elements
            this.elements.petNameDisplay = document.getElementById('petNameDisplay');
            this.elements.petVisual = document.getElementById('petVisual');
            this.elements.petEmotion = document.getElementById('petEmotion');

            // Stat display elements
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

            // Financial elements
            this.elements.currentBudget = document.getElementById('currentBudget');
            this.elements.totalSpent = document.getElementById('totalSpent');
            this.elements.weeklyCosts = document.getElementById('weeklyCosts');

            // Action buttons
            this.elements.feedBtn = document.getElementById('feedBtn');
            this.elements.playBtn = document.getElementById('playBtn');
            this.elements.restBtn = document.getElementById('restBtn');
            this.elements.cleanBtn = document.getElementById('cleanBtn');
            this.elements.healthBtn = document.getElementById('healthBtn');
            this.elements.toyBtn = document.getElementById('toyBtn');

            // Game control buttons
            this.elements.saveGameBtn = document.getElementById('saveGameBtn');
            this.elements.resetGameBtn = document.getElementById('resetGameBtn');

            // Help and modals
            this.elements.helpBtn = document.getElementById('helpBtn');
            this.elements.helpModal = document.getElementById('helpModal');
            this.elements.feedbackModal = document.getElementById('feedbackModal');
            this.elements.feedbackContent = document.getElementById('feedbackContent');
            this.elements.warningModal = document.getElementById('warningModal');
            this.elements.warningContent = document.getElementById('warningContent');
            this.elements.warningConfirmBtn = document.getElementById('warningConfirmBtn');

            // Modal close buttons
            this.elements.modalCloseButtons = document.querySelectorAll('.modal-close');

            // Achievements list
            this.elements.achievementsList = document.getElementById('achievementsList');

            console.log('✅ All DOM elements cached successfully');
        } catch (error) {
            console.error('Error caching DOM elements:', error);
        }
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
        try {
            // Form submission
            this.elements.petSetupForm?.addEventListener('submit', (e) => this._handleFormSubmit(e));

            // Action buttons
            this.elements.feedBtn?.addEventListener('click', () => this._performAction('feed'));
            this.elements.playBtn?.addEventListener('click', () => this._performAction('play'));
            this.elements.restBtn?.addEventListener('click', () => this._performAction('rest'));
            this.elements.cleanBtn?.addEventListener('click', () => this._performAction('clean'));
            this.elements.healthBtn?.addEventListener('click', () => this._performAction('healthCheck'));
            this.elements.toyBtn?.addEventListener('click', () => this._performAction('buyToy'));

            // Game controls
            this.elements.saveGameBtn?.addEventListener('click', () => this._saveGame());
            this.elements.resetGameBtn?.addEventListener('click', () => this._resetGame());

            // Help
            this.elements.helpBtn?.addEventListener('click', () => this._toggleHelpModal());
            this.elements.modalCloseButtons?.forEach(btn => {
                btn.addEventListener('click', (e) => this._closeModal(e));
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => this._handleKeyboard(e));

            console.log('✅ Event listeners attached successfully');
        } catch (error) {
            console.error('Error attaching event listeners:', error);
        }
    }

    /**
     * Handle form submission
     * @private
     */
    _handleFormSubmit(event) {
        event.preventDefault();

        try {
            const petName = this.elements.petName.value.trim();
            const petType = this.elements.petType.value;
            const difficulty = this.elements.difficulty.value;
            const initialBudget = parseInt(this.elements.initialBudget.value);

            // Validate
            if (!petName) {
                alert('Please enter a pet name');
                return;
            }
            if (!petType) {
                alert('Please select a pet type');
                return;
            }
            if (!difficulty) {
                alert('Please select a difficulty level');
                return;
            }
            if (!initialBudget || initialBudget < 100) {
                alert('Please enter a valid budget (minimum $100)');
                return;
            }

            // Initialize game
            const initialized = this.game.initializeGame(petName, petType, initialBudget, difficulty);
            
            if (!initialized) {
                alert('Error creating pet. Please try again.');
                return;
            }

            console.log('✅ Game initialized with:', { petName, petType, difficulty, initialBudget });

            // Switch screens
            this._switchToGameScreen();
            
            // Update UI immediately
            this._updateAllUI();
            
            // Start game loop
            this._startGameLoop();
        } catch (error) {
            console.error('Error in form submission:', error);
            alert('An error occurred: ' + error.message);
        }
    }

    /**
     * Perform a care action
     * @private
     */
    _performAction(action) {
        try {
            // Guard clause - check if game is running
            if (!this.game.isRunning) {
                alert('Game is not running');
                return;
            }

            const result = this.game.performAction(action);

            if (!result.success) {
                this._showWarning(result.message);
                return;
            }

            // Show feedback
            this._showFeedback(result.message, result.emotion);
            
            // Update UI
            this._updateAllUI();

            console.log(`✅ Action performed: ${action}`, result);
        } catch (error) {
            console.error('Error performing action:', error);
            this._showWarning('Error: ' + error.message);
        }
    }

    /**
     * Update all UI elements
     * @private
     */
    _updateAllUI() {
        try {
            if (!this.game.pet) {
                console.warn('Pet not initialized yet');
                return;
            }

            this._updatePetDisplay();
            this._updateStatBars();
            this._updateFinancials();
            this._updateAchievements();

            console.log('✅ UI updated');
        } catch (error) {
            console.error('Error updating UI:', error);
        }
    }

    /**
     * Update pet display
     * @private
     */
    _updatePetDisplay() {
        try {
            const pet = this.game.pet;
            
            // Update name
            this.elements.petNameDisplay.textContent = pet.name;
            
            // Update emotion
            const emotion = pet.getEmotion();
            this.elements.petEmotion.textContent = emotion;
            
            // Update visual
            this.elements.petVisual.textContent = this._getPetEmoji(pet.type);

            // Animate pet
            this.elements.petVisual.classList.remove('bounce', 'shake', 'spin', 'wiggle');
            if (emotion.includes('Happy')) {
                this.elements.petVisual.classList.add('bounce');
            } else if (emotion.includes('Sick')) {
                this.elements.petVisual.classList.add('shake');
            } else if (emotion.includes('Excited')) {
                this.elements.petVisual.classList.add('spin');
            }
        } catch (error) {
            console.error('Error updating pet display:', error);
        }
    }

    /**
     * Update stat bars
     * @private
     */
    _updateStatBars() {
        try {
            const pet = this.game.pet;

            const updateStat = (bar, value, label) => {
                const percentage = Math.max(0, Math.min(100, value));
                bar.style.width = percentage + '%';
                label.textContent = Math.round(percentage) + '%';
            };

            updateStat(this.elements.hungerBar, pet.hunger, this.elements.hungerValue);
            updateStat(this.elements.energyBar, pet.energy, this.elements.energyValue);
            updateStat(this.elements.happinessBar, pet.happiness, this.elements.happinessValue);
            updateStat(this.elements.cleanlinessBar, pet.cleanliness, this.elements.cleanlinessValue);
            updateStat(this.elements.healthBar, pet.health, this.elements.healthValue);
        } catch (error) {
            console.error('Error updating stat bars:', error);
        }
    }

    /**
     * Update financial display - FIXED BUG
     * @private
     */
    _updateFinancials() {
        try {
            const game = this.game;

            // Guard clauses - ensure values exist
            if (game.currentBudget === undefined || game.currentBudget === null) {
                console.warn('currentBudget not initialized');
                this.elements.currentBudget.textContent = '$0.00';
            } else {
                this.elements.currentBudget.textContent = '$' + parseFloat(game.currentBudget).toFixed(2);
            }

            if (game.totalSpent === undefined || game.totalSpent === null) {
                console.warn('totalSpent not initialized');
                this.elements.totalSpent.textContent = '$0.00';
            } else {
                this.elements.totalSpent.textContent = '$' + parseFloat(game.totalSpent).toFixed(2);
            }

            // Weekly costs
            const weeklyCosts = game.getWeeklyCosts?.() || { totalWeekly: 0 };
            this.elements.weeklyCosts.textContent = '$' + parseFloat(weeklyCosts.totalWeekly || 0).toFixed(2);

            // Color budget based on usage
            const budgetPercentage = (game.currentBudget / (game.initialBudget || 1)) * 100;
            if (budgetPercentage < 20) {
                this.elements.currentBudget.style.color = '#ef4444';
            } else if (budgetPercentage < 50) {
                this.elements.currentBudget.style.color = '#f59e0b';
            } else {
                this.elements.currentBudget.style.color = '#10b981';
            }
        } catch (error) {
            console.error('Error updating financials:', error);
            this.elements.currentBudget.textContent = '$0.00';
            this.elements.totalSpent.textContent = '$0.00';
            this.elements.weeklyCosts.textContent = '$0.00';
        }
    }

    /**
     * Update achievements display
     * @private
     */
    _updateAchievements() {
        try {
            if (!this.game.unlockedAchievements) {
                return;
            }

            // Get list of all achievements
            const allAchievements = [
                { id: 'great-parent', name: '🏆 Great Parent', desc: 'All stats > 80%' },
                { id: 'budget-master', name: '💰 Budget Master', desc: 'Spend < 80% of budget' },
                { id: 'pet-expert', name: '🎯 Pet Expert', desc: '50+ care actions' },
                { id: 'loyal-friend', name: '💗 Loyal Friend', desc: '80%+ happiness x7 days' },
            ];

            this.elements.achievementsList.innerHTML = '';

            allAchievements.forEach(achievement => {
                const isUnlocked = this.game.unlockedAchievements.includes(achievement.id);
                const div = document.createElement('div');
                div.className = 'achievement-item ' + (isUnlocked ? 'unlocked' : 'locked');
                div.innerHTML = `<strong>${achievement.name}</strong><br><small>${achievement.desc}</small>`;
                this.elements.achievementsList.appendChild(div);
            });
        } catch (error) {
            console.error('Error updating achievements:', error);
        }
    }

    /**
     * Switch to game screen
     * @private
     */
    _switchToGameScreen() {
        this.elements.setupScreen.classList.remove('active');
        this.elements.gameScreen.classList.add('active');
        this.isGameRunning = true;
    }

    /**
     * Start game loop
     * @private
     */
    _startGameLoop() {
        // Clear any existing loop
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }

        // Update game and UI every 2 seconds
        this.gameLoopInterval = setInterval(() => {
            try {
                if (this.game.isRunning) {
                    this.game.update();
                    this._updateAllUI();

                    // Check for game over
                    if (this.game.currentBudget <= 0) {
                        this._endGame();
                    }
                }
            } catch (error) {
                console.error('Error in game loop:', error);
            }
        }, 2000);
    }

    /**
     * End game
     * @private
     */
    _endGame() {
        clearInterval(this.gameLoopInterval);
        this.game.isRunning = false;
        this._showWarning(`Game Over! Your pet ${this.game.pet.name} needs more care. You spent your entire budget!`);
    }

    /**
     * Save game
     * @private
     */
    _saveGame() {
        try {
            this.game.saveGame();
            this._showFeedback('✅ Game saved successfully!', '💾');
        } catch (error) {
            this._showWarning('Error saving game: ' + error.message);
        }
    }

    /**
     * Reset game
     * @private
     */
    _resetGame() {
        if (confirm('Are you sure you want to start a new game?')) {
            location.reload();
        }
    }

    /**
     * Show feedback message
     * @private
     */
    _showFeedback(message, emotion = '') {
        this.elements.feedbackContent.innerHTML = `<p>${emotion} ${message}</p>`;
        this.elements.feedbackModal.style.display = 'block';
        setTimeout(() => {
            this.elements.feedbackModal.style.display = 'none';
        }, 2000);
    }

    /**
     * Show warning modal
     * @private
     */
    _showWarning(message) {
        this.elements.warningContent.innerHTML = `<p>${message}</p>`;
        this.elements.warningModal.style.display = 'block';
    }

    /**
     * Toggle help modal
     * @private
     */
    _toggleHelpModal() {
        if (this.elements.helpModal.style.display === 'none') {
            this.elements.helpModal.style.display = 'block';
        } else {
            this.elements.helpModal.style.display = 'none';
        }
    }

    /**
     * Close modal
     * @private
     */
    _closeModal(event) {
        event.stopPropagation();
        const modal = event.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Get pet emoji
     * @private
     */
    _getPetEmoji(type) {
        const emojis = {
            dog: '🐕',
            cat: '🐱',
            rabbit: '🐰',
            hamster: '🐹',
            bird: '🦜'
        };
        return emojis[type] || '🐾';
    }

    /**
     * Handle keyboard shortcuts
     * @private
     */
    _handleKeyboard(event) {
        if (!this.game.isRunning) return;

        const keyMap = {
            'f': () => this._performAction('feed'),
            'p': () => this._performAction('play'),
            'r': () => this._performAction('rest'),
            'c': () => this._performAction('clean'),
            'h': () => this._performAction('healthCheck'),
            't': () => this._performAction('buyToy'),
            '?': () => this._toggleHelpModal(),
        };

        const key = event.key.toLowerCase();
        if (keyMap[key]) {
            event.preventDefault();
            keyMap[key]();
        }

        // Ctrl+S for save
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            this._saveGame();
        }
    }
}
