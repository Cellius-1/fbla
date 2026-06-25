/**
 * PETPAL AI — Reports Center
 * Aggregates game data into 4 report types with Chart.js visualizations
 * and downloadable text summaries.
 */

class ReportsCenter {
    constructor(game) {
        this.game   = game;
        this._charts = {};   // { canvasId: Chart instance }
        this._days  = 30;    // active date-range filter
    }

    // ── Date Filtering ────────────────────────────────────────────────────────

    setRange(days) {
        this._days = days;
        this.renderAll();
    }

    _cutoff()  { return this._days > 0 ? Date.now() - this._days * 86400000 : 0; }
    _filterTs(arr) {
        const c = this._cutoff();
        return c ? arr.filter(x => x.ts >= c) : arr;
    }

    // ── Chart Factory ─────────────────────────────────────────────────────────

    _destroy(id) {
        if (this._charts[id]) { this._charts[id].destroy(); delete this._charts[id]; }
    }

    _chart(id, type, data, extraOpts = {}) {
        if (typeof Chart === 'undefined') return;
        this._destroy(id);
        const canvas = document.getElementById(id);
        if (!canvas) return;

        const pxFont = { family: "'Press Start 2P', monospace", size: 7 };
        const baseScales = {
            x: { ticks: { color: '#4a3868', font: pxFont }, grid: { color: 'rgba(0,0,0,0.08)' } },
            y: { ticks: { color: '#4a3868', font: pxFont }, grid: { color: 'rgba(0,0,0,0.10)' } }
        };

        this._charts[id] = new Chart(canvas.getContext('2d'), {
            type,
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 200, easing: 'linear' },
                plugins: {
                    legend: {
                        labels: { color: '#4a3868', font: pxFont, boxWidth: 10, padding: 12 }
                    }
                },
                scales: type !== 'doughnut' ? baseScales : undefined,
                ...extraOpts
            }
        });
    }

    _noData(id, msg = 'No data yet') {
        this._destroy(id);
        const canvas = document.getElementById(id);
        if (!canvas) return;
        canvas.width  = canvas.offsetWidth  || 300;
        canvas.height = canvas.offsetHeight || 200;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle    = '#4a3868';
        ctx.font         = "7px 'Press Start 2P', monospace";
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        // Word-wrap so long messages don't get clipped at canvas edges
        const maxWidth = canvas.width - 32;
        const words = msg.split(' ');
        const lines = [];
        let line = '';
        for (const word of words) {
            const test = line ? line + ' ' + word : word;
            if (ctx.measureText(test).width > maxWidth && line) {
                lines.push(line);
                line = word;
            } else {
                line = test;
            }
        }
        if (line) lines.push(line);
        const lineH = 18;
        const startY = canvas.height / 2 - ((lines.length - 1) * lineH) / 2;
        lines.forEach((l, i) => ctx.fillText(l, canvas.width / 2, startY + i * lineH));
    }

    // ── Stat Chips Row ────────────────────────────────────────────────────────

    _statRow(elId, chips) {
        const el = document.getElementById(elId);
        if (!el) return;
        el.innerHTML = chips.map(([val, label, color]) =>
            `<div class="rstat">
                <div class="rstat-val" style="color:${color || 'var(--text)'}">${val}</div>
                <div class="rstat-label">${label}</div>
            </div>`
        ).join('');
    }

    // ── EXPENSE REPORT ────────────────────────────────────────────────────────

    _renderExpense() {
        const raw  = this.game.storage.loadExpenses();
        const exps = this._filterTs(raw);
        const total = exps.reduce((s, e) => s + (e.cost || 0), 0);

        // By category
        const byCat = {};
        exps.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + (e.cost || 0); });

        // By month (YYYY-MM key for correct sorting)
        const byMonth = {};
        exps.forEach(e => {
            const d = new Date(e.ts);
            const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            byMonth[k] = (byMonth[k] || 0) + (e.cost || 0);
        });

        const avgDay = this._days > 0 ? (total / this._days).toFixed(1) : total;
        const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

        this._statRow('expenseStatRow', [
            [total + ' coins', 'Total Spent',   '#b87800'],
            [exps.length,     'Transactions',  '#0088bb'],
            [avgDay + '/day', 'Daily Avg',     '#dd1060'],
            [topCat ? (CATEGORIES[topCat[0]]?.label || topCat[0]) : 'None', 'Top Category', '#118833']
        ]);

        // ── Doughnut: spending by category
        const catKeys = Object.keys(byCat);
        if (!catKeys.length) {
            this._noData('expenseDoughnut', 'No expenses in this period');
        } else {
            this._chart('expenseDoughnut', 'doughnut', {
                labels: catKeys.map(k => CATEGORIES[k]?.label || k),
                datasets: [{
                    data:            catKeys.map(k => byCat[k]),
                    backgroundColor: catKeys.map(k => (CATEGORIES[k]?.color || '#7c3aed') + 'cc'),
                    borderColor:     catKeys.map(k => CATEGORIES[k]?.color || '#7c3aed'),
                    borderWidth: 2,
                    hoverOffset: 6
                }]
            }, {
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#4a3868', padding: 10, font: { family: "'Press Start 2P', monospace", size: 7 } } }
                }
            });
        }

        // ── Bar: monthly spending
        const sortedMonths = Object.keys(byMonth).sort();
        if (!sortedMonths.length) {
            this._noData('expenseMonthly', 'No monthly data yet');
        } else {
            const labels = sortedMonths.map(k => {
                const [y, m] = k.split('-');
                return new Date(+y, +m - 1, 1).toLocaleString('default', { month: 'short' }) + ` '${y.slice(2)}`;
            });
            this._chart('expenseMonthly', 'bar', {
                labels,
                datasets: [{
                    label: 'Coins Spent',
                    data:  sortedMonths.map(k => byMonth[k]),
                    backgroundColor: 'rgba(119,17,170,0.75)',
                    borderColor:     '#7711aa',
                    borderWidth: 2,
                    borderRadius: 0
                }]
            });
        }
    }

    // ── HEALTH REPORT ─────────────────────────────────────────────────────────

    _renderHealth() {
        const history = this._filterTs(this.game.statHistory || []);
        const pet     = this.game.pet;

        const curr = {
            health:      Math.round(pet?.health      || 0),
            happiness:   Math.round(pet?.happiness   || 0),
            hunger:      Math.round(pet?.hunger      || 0),
            energy:      Math.round(pet?.energy      || 0),
            cleanliness: Math.round(pet?.cleanliness || 0)
        };

        const avg = k => history.length
            ? Math.round(history.reduce((s, h) => s + (h[k] || 0), 0) / history.length)
            : curr[k];

        this._statRow('healthStatRow', [
            [curr.health    + '/100', 'Health Now',    '#118833'],
            [curr.happiness + '/100', 'Happiness Now', '#dd1060'],
            [curr.hunger    + '/100', 'Hunger Now',    '#cc6600'],
            [avg('health')  + ' avg', 'Health Avg',   '#4a3868']
        ]);

        if (history.length < 2) {
            this._noData('healthLineChart', 'Keep playing to build a health history! (auto-recorded every 90 s)');
            return;
        }

        // Downsample to ≤80 points
        const step    = Math.max(1, Math.floor(history.length / 80));
        const sampled = history.filter((_, i) => i % step === 0);

        const labels = sampled.map(h => {
            const d = new Date(h.ts);
            return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
        });

        const pxFont = { family: "'Press Start 2P', monospace", size: 7 };
        const ds = (key, color, bg) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            data:            sampled.map(h => h[key]),
            borderColor:     color,
            backgroundColor: bg,
            tension:         0,
            stepped:         false,
            pointRadius:     0,
            borderWidth:     2,
            fill:            true
        });

        // Read which stat toggles are active; default to all if buttons aren't in DOM yet
        const toggleBtns  = document.querySelectorAll('#healthStatToggles .stat-toggle-btn');
        const activeStats = toggleBtns.length
            ? [...toggleBtns].filter(b => b.classList.contains('active')).map(b => b.dataset.stat)
            : ['health', 'happiness', 'hunger', 'energy', 'cleanliness'];

        const statDefs = [
            { key: 'health',      color: '#118833', bg: 'rgba(17,136,51,0.15)'  },
            { key: 'happiness',   color: '#dd1060', bg: 'rgba(221,16,96,0.12)'  },
            { key: 'hunger',      color: '#cc6600', bg: 'rgba(204,102,0,0.10)'  },
            { key: 'energy',      color: '#6366f1', bg: 'rgba(99,102,241,0.10)' },
            { key: 'cleanliness', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)'  },
        ];

        const datasets = statDefs
            .filter(s => activeStats.includes(s.key))
            .map(s => ds(s.key, s.color, s.bg));

        if (!datasets.length) {
            this._noData('healthLineChart', 'Select at least one stat above to display.');
            return;
        }

        this._chart('healthLineChart', 'line', { labels, datasets }, {
            scales: {
                x: { ticks: { color: '#4a3868', maxTicksLimit: 8, font: pxFont }, grid: { color: 'rgba(0,0,0,0.07)' } },
                y: { min: 0, max: 100, ticks: { color: '#4a3868', stepSize: 20, font: pxFont }, grid: { color: 'rgba(0,0,0,0.09)' } }
            }
        });
    }

    // ── ACHIEVEMENT REPORT ────────────────────────────────────────────────────

    _renderAchievement() {
        const pet    = this.game.pet;
        const badges = this.game.unlockedBadges?.length || 0;
        const tricks = pet?.tricks?.length || 0;
        const level  = pet?.level || 1;

        // XP earned in the selected period: sum action XP from filtered expenses
        // plus XP from filtered chore completions in the income ledger.
        const exps     = this._filterTs(this.game.storage.loadExpenses());
        const income   = this._filterTs(this.game.storage.loadIncome());
        const actionXp = exps.reduce((sum, e) => sum + (ACTIONS[e.action]?.xp || 0), 0);
        const choreXp  = income
            .filter(i => i.source === 'chore')
            .reduce((sum, i) => {
                const chore = CHORES.find(c => c.id === i.choreId);
                return sum + (chore?.xp || 0);
            }, 0);
        const periodXp = actionXp + choreXp;

        this._statRow('achievementStatRow', [
            [`${badges}/12`,   'Badges Earned',  '#b87800'],
            [`${tricks}/9`,    'Tricks Learned', '#7711aa'],
            [`${level}/10`,    'Level Reached',  '#118833'],
            [periodXp + ' XP', 'XP This Period', '#0088bb']
        ]);

        // Horizontal stacked bar
        this._chart('achievementChart', 'bar', {
            labels: ['Badges (max 12)', 'Tricks (max 9)', 'Level (max 10)'],
            datasets: [
                {
                    label: 'Achieved',
                    data:  [badges, tricks, level],
                    backgroundColor: ['rgba(184,120,0,0.85)','rgba(119,17,170,0.85)','rgba(17,136,51,0.85)'],
                    borderColor:     ['#b87800','#7711aa','#118833'],
                    borderWidth: 2,
                    borderRadius: 0
                },
                {
                    label: 'Remaining',
                    data:  [12 - badges, 9 - tricks, 10 - level],
                    backgroundColor: 'rgba(0,0,0,0.07)',
                    borderColor:     'rgba(0,0,0,0.15)',
                    borderWidth: 1,
                    borderRadius: 0
                }
            ]
        }, {
            indexAxis: 'y',
            scales: {
                x: { stacked: true, ticks: { color: '#4a3868', stepSize: 1, font: { family: "'Press Start 2P', monospace", size: 7 } }, grid: { color: 'rgba(0,0,0,0.08)' } },
                y: { stacked: true, ticks: { color: '#1c1030', font: { family: "'Press Start 2P', monospace", size: 7 } }, grid: { display: false } }
            },
            plugins: { legend: { labels: { color: '#4a3868', font: { family: "'Press Start 2P', monospace", size: 7 } } } }
        });

        // Level milestone track
        const trackEl = document.getElementById('achievementLevelTrack');
        if (trackEl) {
            trackEl.innerHTML = Array.from({ length: 10 }, (_, i) => {
                const lv = i + 1;
                const reached = level >= lv;
                return `<div class="level-pip ${reached ? 'reached' : 'locked'}">
                    <div class="level-pip-node">${reached ? '⭐' : lv}</div>
                    <div class="level-pip-label">Lv.${lv}</div>
                </div>`;
            }).join('');
        }
    }

    // ── CARE HISTORY REPORT ───────────────────────────────────────────────────

    _renderCare() {
        const pet = this.game.pet;

        // Use filtered ledgers so action counts respect the selected date range.
        // Sleep has cost:0 and is not persisted to the expense log — its count
        // falls back to the all-time pet counter and is labelled accordingly.
        const exps   = this._filterTs(this.game.storage.loadExpenses());
        const income = this._filterTs(this.game.storage.loadIncome());

        const feeds  = exps.filter(e => e.action === 'feed').length;
        const plays  = exps.filter(e => e.action === 'play').length;
        const cleans = exps.filter(e => e.action === 'clean').length;
        const vets   = exps.filter(e => e.action === 'vet').length;
        const sleeps = pet?.sleepCount || 0;
        const chores = income.filter(i => i.source === 'chore').length;
        const total  = feeds + plays + sleeps + cleans + vets;

        const cutoff      = this._cutoff();
        const periodStart = cutoff || (this.game.startDate || Date.now());
        const days        = Math.max(1, Math.ceil((Date.now() - periodStart) / 86400000));

        this._statRow('careStatRow', [
            [total,                     'Total Actions',  '#7711aa'],
            [days,                      'Days in Period', '#118833'],
            [chores,                    'Chores Done',    '#b87800'],
            [(total / days).toFixed(1), 'Actions / Day',  '#0088bb']
        ]);

        this._chart('careBarChart', 'bar', {
            labels: ['Feed', 'Play', 'Sleep*', 'Clean', 'Vet'],
            datasets: [{
                label: 'Times Performed',
                data:  [feeds, plays, sleeps, cleans, vets],
                backgroundColor: [
                    'rgba(204,102,0,0.85)', 'rgba(221,16,96,0.85)',
                    'rgba(119,17,170,0.85)', 'rgba(0,136,187,0.85)', 'rgba(17,136,51,0.85)'
                ],
                borderColor: ['#cc6600','#dd1060','#7711aa','#0088bb','#118833'],
                borderWidth: 2,
                borderRadius: 0
            }]
        }, {
            plugins: { legend: { display: false } }
        });
    }

    // ── Render All ────────────────────────────────────────────────────────────

    renderAll() {
        if (!this.game.isRunning) return;
        this._renderExpense();
        this._renderHealth();
        this._renderAchievement();
        this._renderCare();
    }

    destroyAll() {
        Object.keys(this._charts).forEach(id => this._destroy(id));
    }

    // ── Download ──────────────────────────────────────────────────────────────

    download(type) {
        const pet  = this.game.pet;
        const now  = new Date();
        const rangeLabel = this._days ? `Last ${this._days} Days` : 'All Time';

        const lines = [
            '╔══════════════════════════════════════════╗',
            '║           PetPal AI — Report             ║',
            '╚══════════════════════════════════════════╝',
            '',
            `  Report Type  : ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            `  Generated    : ${now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}`,
            `  Period       : ${rangeLabel}`,
            `  Pet          : ${pet?.name || '—'} the ${PET_TYPES[pet?.type]?.name || '—'}, Level ${pet?.level || 1}`,
            '',
            '──────────────────────────────────────────'
        ];

        if (type === 'expense') {
            const exps  = this._filterTs(this.game.storage.loadExpenses());
            const total = exps.reduce((s, e) => s + e.cost, 0);
            const byCat = {}, byMonth = {};
            exps.forEach(e => {
                byCat[e.category] = (byCat[e.category] || 0) + e.cost;
                const d = new Date(e.ts), k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
                byMonth[k] = (byMonth[k] || 0) + e.cost;
            });
            lines.push('', `  Total Spent    : ${total} coins`, `  Transactions   : ${exps.length}`,
                `  Daily Average  : ${this._days ? (total / this._days).toFixed(1) : total} coins / day`);
            lines.push('', '  SPENDING BY CATEGORY:');
            Object.entries(byCat).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => {
                const label = (CATEGORIES[k]?.label || k).padEnd(24);
                lines.push(`    ${label} ${v} coins`);
            });
            lines.push('', '  MONTHLY BREAKDOWN:');
            Object.keys(byMonth).sort().forEach(k => {
                lines.push(`    ${k}    ${byMonth[k]} coins`);
            });

        } else if (type === 'health') {
            const history = this._filterTs(this.game.statHistory || []);
            const avg = k => history.length ? Math.round(history.reduce((s,h)=>s+(h[k]||0),0)/history.length) : 'N/A';
            const s = k => Math.round(pet?.[k] || 0);
            lines.push('', '  CURRENT STATS:',
                `    Health         : ${s('health')}/100`,
                `    Happiness      : ${s('happiness')}/100`,
                `    Hunger         : ${s('hunger')}/100`,
                `    Energy         : ${s('energy')}/100`,
                `    Cleanliness    : ${s('cleanliness')}/100`,
                '', `  AVERAGES (${history.length} data points):`,
                `    Health avg     : ${avg('health')}/100`,
                `    Happiness avg  : ${avg('happiness')}/100`,
                `    Hunger avg     : ${avg('hunger')}/100`,
                `    Energy avg     : ${avg('energy')}/100`,
                `    Cleanliness avg: ${avg('cleanliness')}/100`
            );
            if (pet?.isSick) lines.push('', '  [!] Pet is currently sick — visit the vet!');

        } else if (type === 'achievement') {
            const earned   = this.game.unlockedBadges || [];
            const tricks   = pet?.tricks || [];
            const exps     = this._filterTs(this.game.storage.loadExpenses());
            const income   = this._filterTs(this.game.storage.loadIncome());
            const actionXp = exps.reduce((sum, e) => sum + (ACTIONS[e.action]?.xp || 0), 0);
            const choreXp  = income.filter(i => i.source === 'chore')
                .reduce((sum, i) => { const c = CHORES.find(ch => ch.id === i.choreId); return sum + (c?.xp || 0); }, 0);
            lines.push('', `  Level          : ${pet?.level || 1} / 10`,
                `  XP This Period : ${actionXp + choreXp}`,
                `  Badges Earned  : ${earned.length} / 12`,
                `  Tricks Learned : ${tricks.length} / 9`);
            lines.push('', '  BADGES:');
            BADGES.forEach(b => lines.push(`    ${earned.includes(b.id)?'[✓]':'[ ]'} ${b.name.padEnd(20)} ${b.desc}`));
            lines.push('', '  TRICKS:');
            TRICKS.forEach(t => lines.push(`    ${tricks.includes(t.id)?'[✓]':'[ ]'} ${t.name.padEnd(20)} Unlocks at Level ${t.level}`));

        } else if (type === 'care') {
            const exps   = this._filterTs(this.game.storage.loadExpenses());
            const income = this._filterTs(this.game.storage.loadIncome());
            const f  = exps.filter(e => e.action === 'feed').length;
            const p  = exps.filter(e => e.action === 'play').length;
            const cl = exps.filter(e => e.action === 'clean').length;
            const v  = exps.filter(e => e.action === 'vet').length;
            const sl = pet?.sleepCount || 0;
            const ch = income.filter(i => i.source === 'chore').length;
            const cutoff      = this._cutoff();
            const periodStart = cutoff || (this.game.startDate || Date.now());
            const days  = Math.max(1, Math.ceil((Date.now() - periodStart) / 86400000));
            const total = f + p + sl + cl + v;
            lines.push('', `  Days in Period : ${days}`,
                `  Total Actions  : ${total}`,
                `  Actions / Day  : ${(total/days).toFixed(1)}`,
                `  Chores Done    : ${ch}`,
                '', '  ACTION BREAKDOWN:',
                `    Feed           : ${f}`,
                `    Play           : ${p}`,
                `    Sleep          : ${sl} (all-time — free action, not date-filtered)`,
                `    Clean          : ${cl}`,
                `    Vet            : ${v}`);
        }

        lines.push('', '──────────────────────────────────────────',
            '  PetPal AI · FBLA Introduction to Programming', '');

        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url  = URL.createObjectURL(blob);
        const a    = Object.assign(document.createElement('a'), { href: url, download: `petpal-${type}-${now.toISOString().slice(0,10)}.txt` });
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
