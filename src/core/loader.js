/**
 * NeonFrame Loader - Asset loader for images, audio, etc.
 */
export class Loader {
    constructor() {
        this.assets = {};
        this.queue = [];
        this.onProgress = null;
        this.onComplete = null;
    }

    add(key, src, type = 'image') {
        this.queue.push({ key, src, type });
    }

    load() {
        if (this.queue.length === 0) {
            if (this.onComplete) this.onComplete();
            return;
        }
        let loaded = 0;
        const total = this.queue.length;
        for (const asset of this.queue) {
            if (asset.type === 'image') {
                const img = new window.Image();
                img.onload = () => {
                    this.assets[asset.key] = img;
                    loaded++;
                    if (this.onProgress) this.onProgress(loaded / total);
                    if (loaded === total && this.onComplete) this.onComplete();
                };
                img.src = asset.src;
            }
            // TODO: Extend support for other asset types (audio, json, etc)
        }
    }

    get(key) {
        return this.assets[key];
    }
}