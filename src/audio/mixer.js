/**
 * NeonFrame Audio - Mixer for volume control
 */
export class Mixer {
    constructor(context) {
        this.context = context;
        this.masterGain = context.createGain();
        this.masterGain.connect(context.destination);
        this.volume = 1.0;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        this.masterGain.gain.value = this.volume;
    }

    getVolume() {
        return this.volume;
    }
}