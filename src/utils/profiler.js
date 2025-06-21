/**
 * NeonFrame Utils - Simple Profiler
 */
export class Profiler {
    constructor() {
        this.times = {};
        this.enabled = false;
    }

    start(label) {
        if (!this.enabled) return;
        this.times[label] = performance.now();
    }

    end(label) {
        if (!this.enabled || !(label in this.times)) return;
        const elapsed = performance.now() - this.times[label];
        delete this.times[label];
        return elapsed;
    }
}