/**
 * PETPAL AI - UIController
 * Handles all DOM interaction, setup wizard, dashboard updates,
 * tabs, notifications, and the game loop.
 */

class UIController {
    constructor(game) {
        this.game     = game;
        this._tickId  = null;
        this._tickN   = 0;      // count ticks for periodic saves
        this._selectedType        = null;
        this._selectedColor       = null;
        this._selectedPersonality = null;

        this.ai = new AICompanion(game);
        this._chatGreeted = false;

        this.reports    = new ReportsCenter(game);
        this.helpCenter = new HelpCenter();

        this._buildSetupCards();
        this._bindSetup();
        this._bindGame();
        this._startChoreTimer();
    }

    // ══════════════════════════════════════════════════
    // SETUP WIZARD
    // ══════════════════════════════════════════════════

    _buildSetupCards() {
        // Pet type cards
        const typeGrid = document.getElementById('petTypeGrid');
        if (typeGrid) {
            Object.entries(PET_TYPES).forEach(([id, pt]) => {
                const card = document.createElement('div');
                card.className = 'pet-type-card';
                card.dataset.type = id;
                card.setAttribute('role', 'radio');
                card.setAttribute('aria-checked', 'false');
                card.tabIndex = 0;
                const iconHTML = typeof PixelSprites !== 'undefined'
                    ? PixelSprites.setupIconHTML(id, 52)
                    : (typeof Icons !== 'undefined' ? Icons.petSvg(id, 52) : pt.emoji);
                card.innerHTML = `
                    <div class="card-icon">${iconHTML}</div>
                    <div class="card-name">${pt.name}</div>
                    <div class="card-desc">${pt.description}</div>`;
                card.addEventListener('click', () => this._selectType(id));
                card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') this._selectType(id); });
                typeGrid.appendChild(card);
            });
        }

        // Color swatches
        const colorWrap = document.getElementById('colorSwatches');
        if (colorWrap) {
            Object.entries(PET_COLORS).forEach(([id, col]) => {
                const sw = document.createElement('div');
                sw.className = 'color-swatch';
                sw.dataset.color = id;
                sw.style.background = col.hex;
                sw.title = col.name;
                sw.setAttribute('role', 'radio');
                sw.setAttribute('aria-label', col.name);
                sw.tabIndex = 0;
                sw.addEventListener('click', () => this._selectColor(id));
                sw.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') this._selectColor(id); });
                colorWrap.appendChild(sw);
            });
        }

        // Personality cards
        const persGrid = document.getElementById('personalityGrid');
        if (persGrid) {
            Object.entries(PERSONALITIES).forEach(([id, p]) => {
                const card = document.createElement('div');
                card.className = 'personality-card';
                card.dataset.personality = id;
                card.setAttribute('role', 'radio');
                card.tabIndex = 0;
                card.innerHTML = `
                    <div class="p-icon">${typeof Icons !== 'undefined' ? Icons.persSvg(id, 36) : p.emoji}</div>
                    <div class="p-name">${p.name}</div>
                    <div class="p-desc">${p.desc}</div>`;
                card.addEventListener('click', () => this._selectPersonality(id));
                card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') this._selectPersonality(id); });
                persGrid.appendChild(card);
            });
        }
    }

    _selectType(id) {
        this._selectedType = id;
        document.querySelectorAll('.pet-type-card').forEach(c => {
            const sel = c.dataset.type === id;
            c.classList.toggle('selected', sel);
            c.setAttribute('aria-checked', String(sel));
        });
        document.getElementById('toStep2').disabled = false;
        this._updatePreview();
    }

    _selectColor(id) {
        this._selectedColor = id;
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('selected', s.dataset.color === id));
        this._checkStep2Ready();
        this._updatePreview();
    }

    _selectPersonality(id) {
        this._selectedPersonality = id;
        document.querySelectorAll('.personality-card').forEach(c => c.classList.toggle('selected', c.dataset.personality === id));
        this._checkStep2Ready();
        this._updatePreview();
    }

    _checkStep2Ready() {
        const btn = document.getElementById('toStep3');
        if (btn) btn.disabled = !(this._selectedColor && this._selectedPersonality);
    }

    _updatePreview() {
        const emoji = document.getElementById('previewEmoji');
        const aura  = document.getElementById('previewAura');
        const badge = document.getElementById('previewBadge');
        const info  = document.getElementById('previewInfo');

        if (this._selectedType && emoji) {
            if (typeof PixelSprites !== 'undefined') {
                emoji.innerHTML = PixelSprites.setupIconHTML(this._selectedType, 68);
            } else if (typeof Icons !== 'undefined') {
                emoji.innerHTML = Icons.petSvg(this._selectedType, 68);
            } else {
                emoji.textContent = PET_TYPES[this._selectedType].emoji;
            }
        }
        if (this._selectedColor && aura) {
            aura.style.background = PET_COLORS[this._selectedColor].hex;
        }
        if (this._selectedPersonality && badge) {
            if (typeof Icons !== 'undefined') {
                badge.innerHTML = Icons.persSvg(this._selectedPersonality, 18);
            } else {
                badge.textContent = PERSONALITIES[this._selectedPersonality].emoji;
            }
        }

        if (info) {
            const rows = [];
            if (this._selectedType) rows.push(`<div class="preview-info-row"><span class="preview-info-label">Type</span><span class="preview-info-val">${PET_TYPES[this._selectedType].name}</span></div>`);
            if (this._selectedColor) rows.push(`<div class="preview-info-row"><span class="preview-info-label">Color</span><span class="preview-info-val">${PET_COLORS[this._selectedColor].name}</span></div>`);
            if (this._selectedPersonality) rows.push(`<div class="preview-info-row"><span class="preview-info-label">Personality</span><span class="preview-info-val">${PERSONALITIES[this._selectedPersonality].name}</span></div>`);
            info.innerHTML = rows.join('');
        }
    }

    _bindSetup() {
        document.getElementById('toStep2')?.addEventListener('click', () => this._goToStep(2));
        document.getElementById('backToStep1')?.addEventListener('click', () => this._goToStep(1));
        document.getElementById('toStep3')?.addEventListener('click', () => this._goToStep(3));
        document.getElementById('backToStep2')?.addEventListener('click', () => this._goToStep(2));
        document.getElementById('createPetBtn')?.addEventListener('click', () => this._createPet());
        document.getElementById('petNameInput')?.addEventListener('input', () => this._validateNameLive());

        // Saved game buttons
        document.getElementById('loadSavedBtn')?.addEventListener('click', () => this._loadSaved());
        document.getElementById('ignoreSavedBtn')?.addEventListener('click', () => {
            document.getElementById('savedGameBanner').style.display = 'none';
        });
    }

    _goToStep(n) {
        [1, 2, 3].forEach(i => {
            document.getElementById(`wizardStep${i}`)?.classList.toggle('active', i === n);
            document.getElementById(`prog${i}`)?.classList.toggle('active', i === n);
            if (i < n) document.getElementById(`prog${i}`)?.classList.add('done');
        });
        if (n === 3) this._updatePreview();
    }

    _validateNameLive() {
        const input  = document.getElementById('petNameInput');
        const errEl  = document.getElementById('nameError');
        const ctrEl  = document.getElementById('nameCharCount');
        const raw    = input?.value || '';
        const len    = raw.length;

        // Update character counter
        if (ctrEl) {
            ctrEl.textContent = `${len}/20`;
            ctrEl.className   = 'char-counter' + (len > 18 ? (len > 20 ? ' over-limit' : ' near-limit') : '');
        }

        // Live error feedback — only flag definite problems, not incomplete input
        const result = Validator.petNameLive(raw);
        if (!result.ok) {
            if (errEl) { errEl.textContent = result.message; errEl.className = 'input-error shown'; }
            if (input)  input.classList.add('input-invalid');
        } else {
            if (errEl) { errEl.textContent = ''; errEl.className = 'input-error'; }
            if (input)  input.classList.remove('input-invalid');
        }
    }

    _createPet() {
        const input  = document.getElementById('petNameInput');
        const nameRaw = input?.value || '';
        const errEl   = document.getElementById('nameError');

        if (!this._selectedType || !this._selectedColor || !this._selectedPersonality) {
            if (errEl) { errEl.textContent = 'Please complete all steps first.'; errEl.className = 'input-error shown'; }
            return;
        }

        const nameResult = Validator.petName(nameRaw);
        if (!nameResult.ok) {
            if (errEl) { errEl.textContent = nameResult.message; errEl.className = 'input-error shown'; }
            if (input) { input.classList.add('input-invalid'); input.focus(); }
            return;
        }

        this.game.startNew(nameResult.value, this._selectedType, this._selectedColor, this._selectedPersonality);
        this.game.save();
        this._enterGameScreen();
    }

    _loadSaved() {
        if (this.game.load()) {
            this._enterGameScreen();
        } else {
            document.getElementById('savedGameBanner').style.display = 'none';
            this._showToast('Could not load save — starting fresh.', 'warning');
        }
    }

    // ══════════════════════════════════════════════════
    // GAME SCREEN
    // ══════════════════════════════════════════════════

    _enterGameScreen() {
        document.getElementById('setupScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
        // Sync pixel sprite renderer with the loaded/created pet
        if (typeof PixelSprites !== 'undefined' && this.game.pet) {
            PixelSprites.setCurrentPet(this.game.pet.type, this.game.pet.color);
        }
        this._refreshAll();
        this._startLoop();
        this._renderChores();
        this._renderBadges();
        this._renderTricks();
        this._renderPersonality();
        this._renderFinance();
        this._renderHistory();
    }

    _bindGame() {
        // Action buttons
        ['feed','play','sleep','clean','vet'].forEach(a => {
            document.getElementById(`${a}Btn`)?.addEventListener('click', () => this._doAction(a));
        });

        // Header buttons
        document.getElementById('helpBtn')?.addEventListener('click', () => this._toggleHelp(true));
        document.getElementById('saveBtn')?.addEventListener('click', () => {
            this.game.save();
            this._showToast('Game saved!', 'success');
        });
        document.getElementById('resetBtn')?.addEventListener('click', () => this._confirmReset());

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this._switchTab(btn.dataset.tab));
        });

        // Help modal close
        document.getElementById('closeHelp')?.addEventListener('click', () => this._toggleHelp(false));
        document.getElementById('closeHelpBtn')?.addEventListener('click', () => this._toggleHelp(false));
        document.getElementById('helpOverlay')?.addEventListener('click', () => this._toggleHelp(false));

        // Keyboard shortcuts
        document.addEventListener('keydown', e => this._onKey(e));

        // Footer help link (from old html, keep compatibility)
        document.getElementById('footerHelpLink')?.addEventListener('click', e => {
            e.preventDefault();
            this._toggleHelp(true);
        });

        // Reports — filter buttons
        document.querySelectorAll('.report-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.report-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.reports.setRange(parseInt(btn.dataset.days, 10));
            });
        });
        // Reports — download buttons
        document.querySelectorAll('.report-dl-btn').forEach(btn => {
            btn.addEventListener('click', () => this.reports.download(btn.dataset.report));
        });

        // Scrapbook search + filter
        const scrapInput = document.getElementById('scrapSearch');
        if (scrapInput) {
            let _scrapDebounce = null;
            scrapInput.addEventListener('input', () => {
                const clearBtn = document.getElementById('scrapSearchClear');
                if (clearBtn) clearBtn.style.display = scrapInput.value ? 'flex' : 'none';
                clearTimeout(_scrapDebounce);
                _scrapDebounce = setTimeout(() => this._renderScrapbook(), 200);
            });
        }
        document.getElementById('scrapSearchClear')?.addEventListener('click', () => {
            const input = document.getElementById('scrapSearch');
            if (input) { input.value = ''; input.dispatchEvent(new Event('input')); }
        });
        document.getElementById('scrapFilters')?.addEventListener('click', e => {
            const btn = e.target.closest('.scrap-filter');
            if (!btn) return;
            document.querySelectorAll('.scrap-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this._renderScrapbook();
        });

        // Chat
        document.getElementById('apiKeySaveBtn')?.addEventListener('click', () => this._saveApiKey());
        document.getElementById('chatSendBtn')?.addEventListener('click', () => this._sendChatMessage());
        document.getElementById('chatInput')?.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._sendChatMessage(); }
        });
        document.getElementById('chatClearBtn')?.addEventListener('click', () => {
            if (confirm('Clear chat history with your pet?')) {
                this.ai.clearHistory();
                this._chatGreeted = false;
                const msgs = document.getElementById('chatMessages');
                if (msgs) msgs.innerHTML = '<div class="chat-empty"><div class="chat-empty-icon"></div><div>Say hello to your pet!</div></div>';
                this._greetFromPet();
            }
        });
    }

    _onKey(e) {
        if (!this.game.isRunning) return;
        // Don't fire shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const map = { f: 'feed', p: 'play', s: 'sleep', c: 'clean', v: 'vet' };
        if (map[e.key.toLowerCase()]) this._doAction(map[e.key.toLowerCase()]);
        // ? and Escape are handled globally by HelpCenter
        if (e.ctrlKey && e.key === 's') { e.preventDefault(); this.game.save(); this._showToast('Saved!', 'success'); }
    }

    _doAction(actionId) {
        if (!this.game.isRunning) return;
        const result = this.game.doAction(actionId);

        if (!result.success) {
            // soft = advisory block (amber); hard = true error (red)
            this._showToast(result.message, result.soft ? 'warning' : 'danger');
            return;
        }

        // Show advisory note before the success message so it doesn't vanish immediately
        if (result.advisory) {
            this._showToast(result.advisory, 'info');
        }

        // Pet animation
        const animMap = { feed: 'eating', play: 'happy', sleep: 'sleeping', clean: 'happy', vet: 'happy' };
        this._animatePet(animMap[actionId] || 'happy');

        // Pixel particle burst
        if (typeof PixelSprites !== 'undefined') {
            const petWrap = document.getElementById('petEmojiDisplay');
            if (petWrap) {
                const particleMap = { feed: 'star', play: 'heart', clean: 'star', vet: 'heart', sleep: 'zzz' };
                PixelSprites.burstParticles(petWrap, particleMap[actionId] || 'star', 5);
            }
        }

        this._showToast(result.message, 'success');
        this._refreshAll();

        // XP result
        if (result.xpResult?.leveledUp) {
            this._showLevelUp(this.game.pet.level);
        }
        if (result.xpResult?.newTricks?.length) {
            result.xpResult.newTricks.forEach(t => {
                const trickSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 22a10 10 0 0 1-10-10"/><circle cx="12" cy="12" r="4"/></svg>`;
                this._showCelebration(trickSvg, 'New Trick!', t.desc.replace('{{name}}', this.game.pet.name));
            });
        }

        // Badge unlocks
        if (result.newBadges?.length) {
            result.newBadges.forEach(b => {
                this._showCelebration(typeof Icons !== 'undefined' ? Icons.pixelSvg(b.icon, 28) : '', 'Badge Unlocked!', `${b.name}: ${b.desc}`);
            });
            this._renderBadges();
        }

        this._renderTricks();
        this._renderFinance();
        this._renderHistory();

        // Refresh scrapbook live if it's currently visible
        if (document.getElementById('memoriesTab')?.classList.contains('active')) {
            this._renderScrapbook();
        }
    }

    _confirmReset() {
        if (confirm('Start a new game? Your current progress will be lost.')) {
            this._stopLoop();
            this.game.reset();
            location.reload();
        }
    }

    // ══════════════════════════════════════════════════
    // GAME LOOP
    // ══════════════════════════════════════════════════

    _startLoop() {
        this._stopLoop();
        this._tickId = setInterval(() => this._tick(), GAME_CONFIG.TICK_INTERVAL);
    }

    _stopLoop() {
        if (this._tickId) { clearInterval(this._tickId); this._tickId = null; }
    }

    _tick() {
        if (!this.game.isRunning) return;

        const { warnings, newBadges } = this.game.tick();

        this._refreshAll();

        // Show warnings as toasts (throttle: only one every 3 ticks)
        if (warnings.length && this._tickN % 3 === 0) {
            const msgMap = {
                hungry:    `${this.game.pet.name} is hungry. Feed them soon.`,
                tired:     `${this.game.pet.name} is exhausted. Let them sleep.`,
                sad:       `${this.game.pet.name} seems sad. Play with them!`,
                dirty:     `${this.game.pet.name} needs a bath.`,
                lowHealth: `${this.game.pet.name}'s health is low. Visit the vet.`,
                sick:      `${this.game.pet.name} is sick. Visit the vet right away!`
            };
            const msg = msgMap[warnings[0]];
            if (msg) this._showToast(msg, 'warning');
        }

        if (newBadges?.length) {
            newBadges.forEach(b => {
                this._showCelebration(typeof Icons !== 'undefined' ? Icons.pixelSvg(b.icon, 28) : '', 'Badge Unlocked!', b.name);
            });
            this._renderBadges();
        }

        // Refresh scrapbook if it is the active tab
        if (document.getElementById('memoriesTab')?.classList.contains('active')) {
            this._renderScrapbook();
        }

        // Auto-save every 15 ticks
        if (this._tickN % 15 === 0) this.game.save();
        this._tickN++;
    }

    // ══════════════════════════════════════════════════
    // REFRESH / RENDER
    // ══════════════════════════════════════════════════

    _refreshAll() {
        if (!this.game.pet) return;
        const pet = this.game.pet;

        // Header
        this._setText('headerPetName', pet.name);
        this._setText('headerLevel', `Lv.${pet.level}`);
        this._setText('coinsDisplay', this.game.coins);

        // Pet visual
        const typeData = PET_TYPES[pet.type];
        const colorData = PET_COLORS[pet.color];
        const emotion   = pet.getEmotion();

        const petEl = document.getElementById('petEmojiDisplay');
        const hasSheetCanvas = petEl && petEl.querySelector(`canvas[data-pet-type="${pet.type}"]`);
        if (petEl && !hasSheetCanvas && typeof Icons !== 'undefined') {
            petEl.innerHTML = Icons.petSvg(pet.type, 80);
        } else if (petEl && !hasSheetCanvas) {
            petEl.textContent = typeData.emoji;
        }
        const aura = document.getElementById('petAura');
        if (aura && colorData) aura.style.background = colorData.hex;

        const emotionBubble = document.getElementById('emotionBubble');
        if (emotionBubble) {
            const emotionKey = Object.keys(EMOTIONS).find(k => EMOTIONS[k] === emotion) || 'neutral';
            if (typeof Icons !== 'undefined') {
                emotionBubble.innerHTML = Icons.emotionSvg(emotionKey, 18);
            } else {
                emotionBubble.textContent = emotion.emoji;
            }
            emotionBubble.style.animation = 'none';
            void emotionBubble.offsetWidth;
            emotionBubble.style.animation = '';
        }

        this._setText('petDisplayName', pet.name);
        this._setText('petMoodText', pet.getMoodText());

        const sickBadge = document.getElementById('sickBadge');
        if (sickBadge) sickBadge.style.display = pet.isSick ? 'inline-block' : 'none';

        // Idle animation state
        const emojiEl = document.getElementById('petEmojiDisplay');
        if (emojiEl) {
            emojiEl.className = 'pet-emoji-display';
            const key = Object.keys(EMOTIONS).find(k => EMOTIONS[k] === emotion);
            if (key === 'sad')      emojiEl.classList.add('pet-state-sad');
            else if (key === 'sick') emojiEl.classList.add('pet-state-sick');
            else                    {} // default idle bob from CSS
        }

        // XP
        const xpInLevel  = pet.getXpInCurrentLevel();
        const xpForNext   = pet.getXpToNextLevel();
        const xpPct       = Math.min(100, (xpInLevel / xpForNext) * 100);
        this._setText('xpLevel', pet.level);
        this._setText('xpCount', `${xpInLevel} / ${xpForNext} XP`);
        this._setWidth('xpBarFill', xpPct);

        // Growth tab mirrors
        this._setText('growthLevelNum', pet.level);
        this._setText('growthLevelText', pet.level);
        this._setText('growthXpText', `${xpInLevel} / ${xpForNext} XP`);
        this._setWidth('growthXpFill', xpPct);

        // Stats
        const stats = [
            ['hunger', 'hungerFill', 'hungerVal'],
            ['happiness', 'happinessFill', 'happinessVal'],
            ['health', 'healthFill', 'healthVal'],
            ['energy', 'energyFill', 'energyVal'],
            ['cleanliness', 'cleanlinessFill', 'cleanlinessVal']
        ];
        stats.forEach(([stat, fillId, valId]) => {
            const val = Math.round(pet[stat]);
            this._setWidth(fillId, val);
            this._setText(valId, val);

            // Flash if critical
            const fillEl = document.getElementById(fillId);
            if (fillEl) fillEl.classList.toggle('critical', val < 20);
        });

        // Disable buttons when can't afford
        ['feed','play','sleep','clean','vet'].forEach(a => {
            const btn = document.getElementById(`${a}Btn`);
            if (!btn) return;
            const cost = ACTIONS[a].cost;
            btn.disabled = cost > this.game.coins;
        });
    }

    _renderFinance() {
        const summary = this.game.getFinanceSummary();

        this._setText('finCoins',  this.game.coins);
        this._setText('finSpent',  this.game.totalSpent);
        this._setText('finEarned', this.game.totalEarned);

        // Spending categories
        const catEl = document.getElementById('spendingCategories');
        if (catEl) {
            const maxVal = Math.max(1, ...Object.values(summary.spentByCategory));
            catEl.innerHTML = Object.entries(CATEGORIES).map(([catId, cat]) => {
                const amt = summary.spentByCategory[catId] || 0;
                if (catId === 'free') return '';
                const pct = Math.min(100, (amt / maxVal) * 100);
                return `
                <div class="spend-cat-row">
                    <span class="spend-cat-icon">${typeof Icons !== 'undefined' ? Icons.pixelSvg(cat.icon, 18) : ''}</span>
                    <div class="spend-cat-bar-wrap">
                        <div class="spend-cat-label">${cat.label}</div>
                        <div class="spend-cat-bar-bg">
                            <div class="spend-cat-bar-fill" style="width:${pct}%;background:${cat.color}"></div>
                        </div>
                    </div>
                    <span class="spend-cat-amount">${amt}</span>
                </div>`;
            }).join('');
        }

        // Recent transactions
        const txEl = document.getElementById('transactionList');
        if (txEl) {
            const expenses = summary.recentExpenses;
            const income   = summary.recentIncome;

            // Merge and sort by ts desc
            const all = [
                ...expenses.map(e => ({ ...e, kind: 'expense' })),
                ...income.map(i => ({ ...i, kind: 'income' }))
            ].sort((a, b) => b.ts - a.ts).slice(0, 12);

            if (!all.length) {
                txEl.innerHTML = '<div class="empty-state">No transactions yet.</div>';
            } else {
                txEl.innerHTML = all.map(tx => {
                    const isExp = tx.kind === 'expense';
                    const iconName = isExp ? (ACTIONS[tx.action]?.icon || 'coin') : (tx.source === 'chore' ? 'check' : 'coin');
                    const iconHtml = typeof Icons !== 'undefined' ? Icons.pixelSvg(iconName, 16) : '';
                    const label = isExp ? (ACTIONS[tx.action]?.label || tx.label || 'Purchase') : (tx.name || 'Bonus');
                    const amt   = isExp ? `-${tx.cost}` : `+${tx.amount}`;
                    const cls   = isExp ? 'expense' : 'income';
                    const time  = this._timeAgo(tx.ts);
                    return `
                    <div class="transaction-item">
                        <span class="tx-icon">${iconHtml}</span>
                        <span class="tx-label">${label}</span>
                        <span class="tx-amount ${cls}">${amt}</span>
                        <span class="tx-time">${time}</span>
                    </div>`;
                }).join('');
            }
        }
    }

    _renderBadges() {
        const grid = document.getElementById('badgeGrid');
        if (!grid) return;

        grid.innerHTML = BADGES.map(badge => {
            const unlocked = this.game.unlockedBadges.includes(badge.id);
            return `
            <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}" title="${badge.desc}">
                <span class="badge-item-icon">${typeof Icons !== 'undefined' ? Icons.pixelSvg(badge.icon, 20) : ''}</span>
                <div class="badge-item-name">${badge.name}</div>
                <div class="badge-item-desc">${badge.desc}</div>
            </div>`;
        }).join('');

        this._setText('badgeCount', `${this.game.unlockedBadges.length}/${BADGES.length}`);
    }

    _renderTricks() {
        const el = document.getElementById('tricksList');
        if (!el || !this.game.pet) return;

        const learnedIds = this.game.pet.tricks;
        el.innerHTML = TRICKS.map(trick => {
            const unlocked = learnedIds.includes(trick.id);
            const desc = trick.desc.replace('{{name}}', this.game.pet.name);
            return `
            <div class="trick-item ${unlocked ? 'unlocked' : 'locked'}">
                <span class="trick-icon">${typeof Icons !== 'undefined' ? Icons.pixelSvg(trick.icon, 20) : ''}</span>
                <div class="trick-info">
                    <div class="trick-name">${trick.name}</div>
                    <div class="trick-desc">${unlocked ? desc : 'Reach Level ' + trick.level + ' to unlock'}</div>
                </div>
                <span class="trick-level-badge">${unlocked ? 'Learned' : 'Lv.' + trick.level}</span>
            </div>`;
        }).join('');
    }

    _renderChores() {
        const el = document.getElementById('choresList');
        if (!el) return;
        el.innerHTML = CHORES.map(chore => {
            const info = this.game.getChoreCooldownInfo(chore.id);
            const ready = info?.ready ?? true;
            const cooldownTxt = !ready
                ? `Ready in ${Math.ceil(info.remaining / 60000)} min`
                : 'Ready!';
            return `
            <div class="chore-item">
                <span class="chore-icon">${typeof Icons !== 'undefined' ? Icons.pixelSvg(chore.icon, 22) : ''}</span>
                <div class="chore-info">
                    <div class="chore-name">${chore.name}</div>
                    <div class="chore-reward">+${chore.reward} coins &nbsp;|&nbsp; +${chore.xp} XP</div>
                    ${!ready ? `<div class="chore-cooldown">${cooldownTxt}</div>` : ''}
                </div>
                <button class="chore-do-btn" data-chore="${chore.id}" ${ready ? '' : 'disabled'}>
                    ${ready ? 'Do It!' : 'Cooling…'}
                </button>
            </div>`;
        }).join('');

        // Bind chore buttons
        el.querySelectorAll('.chore-do-btn').forEach(btn => {
            btn.addEventListener('click', () => this._doChore(btn.dataset.chore));
        });
    }

    _startChoreTimer() {
        // Refresh chore cooldowns every 30s
        setInterval(() => {
            if (this.game.isRunning) this._renderChores();
        }, 30000);
    }

    _doChore(choreId) {
        const result = this.game.doChore(choreId);
        if (!result.success) {
            this._showToast(result.message, 'warning');
            return;
        }
        this._showToast(result.message, 'success');
        this._refreshAll();
        this._renderChores();
        this._renderFinance();
        this._renderHistory();

        if (result.xpResult?.leveledUp) this._showLevelUp(this.game.pet.level);
        if (result.newBadges?.length) {
            result.newBadges.forEach(b => {
                this._showCelebration(typeof Icons !== 'undefined' ? Icons.pixelSvg(b.icon, 28) : '', 'Badge Unlocked!', b.name);
            });
            this._renderBadges();
        }
    }

    _renderHistory() {
        const el = document.getElementById('activityLog');
        if (!el || !this.game.activityLog) return;
        if (!this.game.activityLog.length) {
            el.innerHTML = '<div class="empty-state">No activity yet. Start caring for your pet!</div>';
            return;
        }
        el.innerHTML = this.game.activityLog.map(entry => {
            const svgMatch = entry.text.match(/^(<svg[\s\S]*?<\/svg>)\s*([\s\S]*)$/);
            const icon = svgMatch ? svgMatch[1] : '';
            const text = svgMatch ? svgMatch[2] : entry.text;
            return `<div class="log-entry">
                ${icon ? `<span class="log-icon">${icon}</span>` : ''}
                <span class="log-text">${text}</span>
                <span class="log-time">${this._timeAgo(entry.ts)}</span>
            </div>`;
        }).join('');
    }

    _renderPersonality() {
        const engine = this.game.personality;
        if (!engine) return;

        const traits  = engine.getCurrentTraits();
        const stats   = engine.getBehaviorStats();
        const history = engine.getHistory();

        // ── Weekly care chips ────────────────────────────────────────────────
        const careEl = document.getElementById('careWeekChips');
        if (careEl) {
            careEl.innerHTML = [
                ['Fed',    stats.weekFeeds,  'times'],
                ['Played', stats.weekPlays,  'times'],
                ['Chatted',stats.weekChats,  'times'],
                ['Chores', stats.weekChores, 'done']
            ].map(([lbl, val, unit]) => `
                <span class="care-chip">
                    ${lbl} <span class="care-chip-val">${val}</span> ${unit} this week
                </span>`).join('');
        }

        // ── Trait bars ───────────────────────────────────────────────────────
        const traitsEl = document.getElementById('personalityTraits');
        if (traitsEl) {
            traitsEl.innerHTML = Object.entries(traits).map(([key, val]) => {
                const meta = engine.getTraitMeta(key, val);
                return `
                <div class="trait-row">
                    <div class="trait-header">
                        <span class="trait-icon">${typeof Icons !== 'undefined' ? Icons.pixelSvg(meta.icon, 14) : ''}</span>
                        <span class="trait-name">${this._traitDisplayName(key)}</span>
                        <span class="trait-level-label" style="color:${meta.color}">${meta.label}</span>
                    </div>
                    <div class="trait-bar-bg">
                        <div class="trait-bar-fill" style="width:${val}%;background:${meta.color}"></div>
                    </div>
                </div>`;
            }).join('');
        }

        // ── Evolution timeline ────────────────────────────────────────────────
        const timelineEl = document.getElementById('evolutionTimeline');
        if (timelineEl) {
            if (!history.length) {
                timelineEl.innerHTML = '<div class="empty-state">No evolution events yet — keep caring for your pet!</div>';
                return;
            }
            timelineEl.innerHTML = history.map(entry => {
                const traitSnap = Object.entries(entry.traits || {}).map(([key, val]) => {
                    const meta = engine.getTraitMeta(key, val);
                    return `<span class="timeline-trait-val" style="color:${meta.color}">${typeof Icons !== 'undefined' ? Icons.pixelSvg(meta.icon, 11) : ''} ${val}</span>`;
                }).join('');

                return `
                <div class="timeline-entry">
                    <div class="timeline-dot-wrap">
                        <div class="timeline-dot">${typeof Icons !== 'undefined' ? Icons.pixelSvg(entry.icon || 'sparkle', 14) : ''}</div>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-event">${entry.event}</div>
                        <div class="timeline-note">${entry.note}</div>
                        <div class="timeline-trait-snapshot">${traitSnap}</div>
                        <div class="timeline-time">${this._timeAgo(entry.ts)}</div>
                    </div>
                </div>`;
            }).join('');
        }
    }

    _traitDisplayName(key) {
        return { affection: 'Affection', energy: 'Energy', talkativeness: 'Talkativeness', mood: 'Mood' }[key] || key;
    }

    // ══════════════════════════════════════════════════
    // MEMORY SCRAPBOOK
    // ══════════════════════════════════════════════════

    _renderScrapbook() {
        const scrapbook = this.game.scrapbook;
        const grid     = document.getElementById('scrapGrid');
        const empty    = document.getElementById('scrapEmpty');
        const countEl  = document.getElementById('scrapCount');
        if (!grid || !scrapbook) return;

        const search   = (document.getElementById('scrapSearch')?.value || '');
        const activeFilter = document.querySelector('.scrap-filter.active');
        const category = activeFilter?.dataset?.type || 'all';

        const entries = scrapbook.getEntries({ search, category });

        // Update count line
        if (countEl) {
            const total = scrapbook.getCount();
            if (search || category !== 'all') {
                countEl.textContent = entries.length === total
                    ? `${total} ${total === 1 ? 'memory' : 'memories'}`
                    : `${entries.length} of ${total} ${total === 1 ? 'memory' : 'memories'}`;
            } else {
                countEl.textContent = total
                    ? `${total} ${total === 1 ? 'memory' : 'memories'} recorded`
                    : '';
            }
        }

        // Empty state
        const isEmpty = entries.length === 0;
        grid.style.display  = isEmpty ? 'none' : '';
        if (empty) {
            empty.style.display = isEmpty ? 'flex' : 'none';
            if (isEmpty) {
                const titleEl = document.getElementById('scrapEmptyTitle');
                const subEl   = document.getElementById('scrapEmptySub');
                if (search && titleEl) titleEl.textContent = 'No matching memories';
                if (search && subEl)   subEl.textContent = `No memories match "${search}". Try a different search term.`;
                if (!search && category !== 'all' && titleEl) titleEl.textContent = 'No memories in this category';
                if (!search && category !== 'all' && subEl)   subEl.textContent = 'Keep playing and caring for your pet to unlock more moments.';
                if (!search && category === 'all' && titleEl) titleEl.textContent = 'No memories yet';
                if (!search && category === 'all' && subEl)   subEl.textContent = 'Keep playing and caring for your pet. Special moments will appear here automatically.';
            }
        }

        if (isEmpty) { grid.innerHTML = ''; return; }

        grid.innerHTML = entries.map((entry, i) => {
            const palette = Scrapbook.PALETTES[entry.type] || Scrapbook.PALETTES.milestone;
            const iconKey = Scrapbook.ICONS[entry.type]   || 'trophy';
            const iconSvg = typeof Icons !== 'undefined'
                ? Icons.pixelSvg(iconKey, 13)
                : '';
            const levelTag = entry.petLevel != null ? `Lv. ${entry.petLevel}` : '';

            return `<div class="memory-card" style="animation-delay:${Math.min(i, 8) * 30}ms" aria-label="${entry.title}">
                <div class="memory-card-stripe" style="background:${palette.color}"></div>
                <div class="memory-card-inner">
                    <div class="memory-card-header">
                        <div class="memory-type-badge" style="color:${palette.color};border-color:${palette.color}22">
                            ${iconSvg}<span>${palette.label}</span>
                        </div>
                        <div class="memory-date">${scrapbook._timeAgo(entry.ts)}</div>
                    </div>
                    <div class="memory-title">${this._escHtml(entry.title)}</div>
                    <div class="memory-text">${this._escHtml(entry.memory)}</div>
                    ${levelTag ? `<div class="memory-footer"><span class="memory-level">${levelTag}</span></div>` : ''}
                </div>
            </div>`;
        }).join('');
    }

    _escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ══════════════════════════════════════════════════
    // TABS
    // ══════════════════════════════════════════════════

    _switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === tabName);
            b.setAttribute('aria-selected', String(b.dataset.tab === tabName));
        });
        document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `${tabName}Tab`));

        // Refresh content when switching
        if (tabName === 'finance')  this._renderFinance();
        if (tabName === 'growth')   { this._renderBadges(); this._renderTricks(); this._renderPersonality(); }
        if (tabName === 'chores')   this._renderChores();
        if (tabName === 'history')  this._renderHistory();
        if (tabName === 'memories') this._renderScrapbook();
        if (tabName === 'chat')     this._openChatTab();
        if (tabName === 'reports')  this.reports.renderAll();
    }

    // ══════════════════════════════════════════════════
    // NOTIFICATIONS
    // ══════════════════════════════════════════════════

    _showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const svgIcons = typeof Icons !== 'undefined' ? {
            success: Icons.pixelSvg('check', 16),
            warning: Icons.pixelSvg('warn', 16),
            danger:  Icons.pixelSvg('close', 16),
            info:    Icons.pixelSvg('info', 16),
        } : {};
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span class="toast-icon">${svgIcons[type] || svgIcons.info}</span><span class="toast-text">${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 350);
        }, 3500);
    }

    _showCelebration(icon, title, desc) {
        const popup = document.getElementById('celebrationPopup');
        if (!popup) return;

        const celebIconEl = document.getElementById('celebIcon');
        if (celebIconEl) celebIconEl.innerHTML = icon;
        this._setText('celebTitle', title);
        this._setText('celebDesc',  desc);

        popup.style.display = 'block';
        popup.style.animation = 'none';
        void popup.offsetWidth;
        popup.style.animation = 'celebIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards';

        setTimeout(() => { popup.style.display = 'none'; }, 3000);
    }

    _showLevelUp(level) {
        const el = document.getElementById('levelUpAnim');
        if (!el) return;
        el.textContent = `LEVEL ${level}`;
        el.style.display = 'block';
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = 'levelUpFlash 1.5s ease forwards';
        setTimeout(() => { el.style.display = 'none'; }, 1600);

        const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        this._showCelebration(starSvg, `Level ${level}!`, `${this.game.pet.name} reached Level ${level}!`);
    }

    // ══════════════════════════════════════════════════
    // HELP MODAL
    // ══════════════════════════════════════════════════

    _toggleHelp(open) {
        if (open) this.helpCenter?.open('faq');
        else      this.helpCenter?.close();
    }

    // ══════════════════════════════════════════════════
    // PET ANIMATION
    // ══════════════════════════════════════════════════

    _animatePet(state) {
        const el = document.getElementById('petEmojiDisplay');
        if (!el) return;
        const stateClass = `pet-state-${state}`;
        el.classList.remove('pet-state-happy', 'pet-state-sad', 'pet-state-sick', 'pet-state-sleeping', 'pet-state-eating');
        el.classList.add(stateClass);
        // Drive pixel sprite frame for eating/sleeping states
        if (typeof PixelSprites !== 'undefined') {
            PixelSprites.updateMainDisplay(state);
            setTimeout(() => { PixelSprites.updateMainDisplay('idle'); el.classList.remove(stateClass); }, 2000);
        } else {
            setTimeout(() => el.classList.remove(stateClass), 2000);
        }
    }

    // ══════════════════════════════════════════════════
    // DOM HELPERS
    // ══════════════════════════════════════════════════

    _setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    _setWidth(id, pct) {
        const el = document.getElementById(id);
        if (el) el.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    }

    _timeAgo(ts) {
        const sec = Math.floor((Date.now() - ts) / 1000);
        if (sec < 60)   return 'just now';
        if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
        if (sec < 86400)return `${Math.floor(sec / 3600)}h ago`;
        return `${Math.floor(sec / 86400)}d ago`;
    }

    // ══════════════════════════════════════════════════
    // AI COMPANION CHAT
    // ══════════════════════════════════════════════════

    _openChatTab() {
        if (!this.ai) return;
        const setupEl = document.getElementById('apiKeySetup');
        const chatEl  = document.getElementById('chatWindow');

        if (!this.ai.hasApiKey()) {
            if (setupEl) setupEl.style.display = 'block';
            if (chatEl)  chatEl.style.display  = 'none';
            return;
        }

        if (setupEl) setupEl.style.display = 'none';
        if (!chatEl) return;
        chatEl.style.display = 'flex';
        this._updateChatHeader();
        if (!this._chatGreeted) this._greetFromPet();
    }

    _saveApiKey() {
        const input  = document.getElementById('apiKeyInput');
        const errEl  = document.getElementById('apiKeyError');
        const result = Validator.apiKey(input?.value || '');

        if (!result.ok) {
            if (errEl) { errEl.textContent = result.message; errEl.style.display = 'block'; }
            this._showToast(result.message, 'danger');
            return;
        }

        if (errEl) errEl.style.display = 'none';
        this.ai.setApiKey(result.value);
        if (input) input.value = '';
        this._showToast('AI Companion connected!', 'success');
        this._openChatTab();
    }

    _updateChatHeader() {
        const pet = this.game.pet;
        if (!pet) return;
        const chatPetEmojiEl = document.getElementById('chatPetEmoji');
        if (chatPetEmojiEl) {
            chatPetEmojiEl.innerHTML = typeof Icons !== 'undefined'
                ? Icons.pixelSvg('medical_cross', 30)
                : '🩺';
        }
        this._setText('chatPetName',   'Dr. Paws');
        this._setText('chatPetStatus', `Advising on ${pet.name}`);

        const chipsEl = document.getElementById('chatTraitChips');
        if (chipsEl) chipsEl.innerHTML = '';
    }

    _addChatMessage(role, text, isError = false) {
        const container = document.getElementById('chatMessages');
        if (!container) return null;

        const emptyEl = container.querySelector('.chat-empty');
        if (emptyEl) emptyEl.remove();

        const avatar = typeof Icons !== 'undefined'
            ? (role === 'pet' ? Icons.pixelSvg('medical_cross', 22) : Icons.pixelSvg('user', 22))
            : (role === 'pet' ? '🩺' : '');

        const msgEl = document.createElement('div');
        msgEl.className = `chat-msg ${role}${isError ? ' error' : ''}`;
        msgEl.innerHTML = `
            <div class="chat-msg-avatar">${avatar}</div>
            <div class="chat-bubble"></div>`;

        const bubble = msgEl.querySelector('.chat-bubble');
        bubble.textContent = text;

        container.appendChild(msgEl);
        container.scrollTop = container.scrollHeight;
        return bubble;
    }

    _showTypingIndicator(show) {
        const el = document.getElementById('typingIndicator');
        if (el) el.style.display = show ? 'block' : 'none';
        if (show) {
            const c = document.getElementById('chatMessages');
            if (c) c.scrollTop = c.scrollHeight;
        }
    }

    _greetFromPet() {
        if (!this.ai || !this.game.pet) return;
        this._chatGreeted = true;

        const pet = this.game.pet;
        const prompt = this.ai.history.length <= 1
            ? `Introduce yourself as Dr. Paws and give the player a quick, friendly first check-up on ${pet.name} based on their current stats. Point out the most important thing to do right now. Two sentences max.`
            : `Welcome the player back as Dr. Paws. Give a quick update on how ${pet.name} is doing right now and what needs attention most. Two sentences max.`;

        this._showTypingIndicator(true);
        let streamBubble = null;

        this.ai.chatStream(
            prompt,
            (_token, full) => {
                this._showTypingIndicator(false);
                if (!streamBubble) {
                    streamBubble = this._addChatMessage('pet', full);
                } else {
                    streamBubble.textContent = full;
                    const c = document.getElementById('chatMessages');
                    if (c) c.scrollTop = c.scrollHeight;
                }
            },
            (full) => {
                this._showTypingIndicator(false);
                if (streamBubble) streamBubble.textContent = full;
            },
            (_err) => {
                this._showTypingIndicator(false);
            }
        );
    }

    _sendChatMessage() {
        if (!this.ai || this.ai.isStreaming) return;
        const input  = document.getElementById('chatInput');
        const result = Validator.chatMessage(input?.value || '');
        if (!result.ok) {
            // Brief shake to signal the error without a modal
            input?.classList.add('input-shake');
            setTimeout(() => input?.classList.remove('input-shake'), 500);
            return;
        }
        const msg = result.value;

        if (input) input.value = '';
        const sendBtn = document.getElementById('chatSendBtn');
        if (sendBtn) sendBtn.disabled = true;

        this._addChatMessage('user', msg);
        this._showTypingIndicator(true);

        let streamBubble = null;

        this.ai.chatStream(
            msg,
            (_token, full) => {
                this._showTypingIndicator(false);
                if (!streamBubble) {
                    streamBubble = this._addChatMessage('pet', full);
                } else {
                    streamBubble.textContent = full;
                    const c = document.getElementById('chatMessages');
                    if (c) c.scrollTop = c.scrollHeight;
                }
            },
            (full) => {
                this._showTypingIndicator(false);
                if (streamBubble) streamBubble.textContent = full;
                if (sendBtn) sendBtn.disabled = false;
                const input2 = document.getElementById('chatInput');
                if (input2) input2.focus();
            },
            (err) => {
                this._showTypingIndicator(false);
                this._addChatMessage('pet', `Oops — ${err}`, true);
                if (sendBtn) sendBtn.disabled = false;
            }
        );
    }
}
