/**
 * NeonFrame Time - Delta time and timing utilities
 */
export class Time {
    constructor() {
        this.now = 0;
        this.last = 0;
        this.delta = 0;
        this.elapsed = 0;
    }

    update(now) {
        this.now = now;
        this.delta = (this.last === 0) ? 0 : (this.now - this.last) / 1000;
        this.elapsed += this.delta;
        this.last = this.now;
        return this.delta;
    }
}