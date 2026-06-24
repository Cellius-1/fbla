/**
 * PETPAL AI — Entry Point
 * Initializes Game and UIController, checks for saved data.
 */

let game = null;
let ui   = null;

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    ui   = new UIController(game);

    // Show saved-game banner if a save exists
    if (game.storage.hasSavedGame()) {
        const banner = document.getElementById('savedGameBanner');
        if (banner) banner.style.display = 'block';
    }

    console.log('🐾 PetPal AI loaded. Type DEBUG.help() in the console for utilities.');
});

// Save before navigating away
window.addEventListener('beforeunload', () => {
    if (game?.isRunning) game.save();
});

// ── Debug utilities (accessible in browser console) ──────────────────────────
window.DEBUG = {
    help: () => {
        console.log([
            'DEBUG.state()        — print game state',
            'DEBUG.setStat(s, v)  — set a pet stat (0-100)',
            'DEBUG.addCoins(n)    — add coins',
            'DEBUG.makeSick()     — make pet sick',
            'DEBUG.heal()         — fully heal pet',
            'DEBUG.levelUp()      — add 100 XP',
            'DEBUG.clearSave()    — delete saved game'
        ].join('\n'));
    },
    state:    () => ({ pet: game?.pet?.toJSON(), coins: game?.coins }),
    setStat:  (stat, val) => { if (game?.pet) { game.pet[stat] = Math.max(0, Math.min(100, val)); ui?._refreshAll(); } },
    addCoins: (n) => { if (game) { game.coins += n; ui?._refreshAll(); ui?._renderFinance(); } },
    makeSick: () => { if (game?.pet) { game.pet.isSick = true; game.pet.health = Math.max(0, game.pet.health - 20); ui?._refreshAll(); } },
    heal:     () => { if (game?.pet) { game.pet.isSick = false; game.pet.health = 100; ui?._refreshAll(); } },
    levelUp:  () => { if (game?.pet) { const r = game.pet.addXp(100); ui?._refreshAll(); if (r.leveledUp) ui?._showLevelUp(game.pet.level); } },
    clearSave:() => { game?.storage.clearAll(); console.log('Save cleared. Reload to start fresh.'); }
};
