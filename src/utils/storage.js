/**
 * NeonFrame Utils - Storage (localStorage wrapper)
 */
export class Storage {
    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    static get(key, def = null) {
        const val = localStorage.getItem(key);
        if (val === null) return def;
        try {
            return JSON.parse(val);
        } catch {
            return def;
        }
    }
    static remove(key) {
        localStorage.removeItem(key);
    }
    static clear() {
        localStorage.clear();
    }
}