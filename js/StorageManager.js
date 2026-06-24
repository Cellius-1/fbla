/**
 * PETPAL AI - StorageManager
 * All localStorage persistence.
 */

class StorageManager {
    constructor() {
        this.key = GAME_CONFIG.STORAGE_KEY;
    }

    saveGame(data) {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }

    loadGame() {
        try {
            const raw = localStorage.getItem(this.key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }

    hasSavedGame() {
        return localStorage.getItem(this.key) !== null;
    }

    deleteGame() {
        localStorage.removeItem(this.key);
    }

    // Expense ledger — kept separately to avoid bloat
    saveExpense(entry) {
        try {
            const expKey = `${this.key}_expenses`;
            let list = this._loadList(expKey);
            if (list.length >= 200) list = list.slice(-199);
            list.push({ ts: Date.now(), ...entry });
            localStorage.setItem(expKey, JSON.stringify(list));
        } catch (e) { /* ignore quota errors silently */ }
    }

    loadExpenses() {
        return this._loadList(`${this.key}_expenses`);
    }

    // Income ledger
    saveIncome(entry) {
        try {
            const incKey = `${this.key}_income`;
            let list = this._loadList(incKey);
            if (list.length >= 200) list = list.slice(-199);
            list.push({ ts: Date.now(), ...entry });
            localStorage.setItem(incKey, JSON.stringify(list));
        } catch (e) { /* ignore */ }
    }

    loadIncome() {
        return this._loadList(`${this.key}_income`);
    }

    clearAll() {
        [`${this.key}`, `${this.key}_expenses`, `${this.key}_income`]
            .forEach(k => localStorage.removeItem(k));
    }

    _loadList(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : [];
        } catch { return []; }
    }
}

if (typeof module !== 'undefined' && module.exports) module.exports = StorageManager;
