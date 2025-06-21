/**
 * NeonFrame Audio - Sound Effect
 */
export class Sound {
    constructor(context, buffer) {
        this.context = context;
        this.buffer = buffer;
        this.volume = 1.0;
        this.loop = false;
    }

    play() {
        const source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.loop = this.loop;
        const gain = this.context.createGain();
        gain.gain.value = this.volume;
        source.connect(gain).connect(this.context.destination);
        source.start(0);
        this._source = source;
    }

    stop() {
        if (this._source) this._source.stop();
    }
}

export function loadSound(context, url, callback) {
    fetch(url)
        .then(res => res.arrayBuffer())
        .then(data => context.decodeAudioData(data, buffer => {
            callback(new Sound(context, buffer));
        }));
}