/**
 * NeonFrame Animation - Sprite sheet animation handler
 */
export class Animation {
    constructor(sprite, frameWidth, frameHeight, frames = [], fps = 10, loop = true) {
        this.sprite = sprite;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frames = frames.length ? frames : this._generateFrames();
        this.fps = fps;
        this.loop = loop;
        this.current = 0;
        this.timer = 0;
        this.playing = true;
    }

    _generateFrames() {
        // Automatically generate frame rects for full sheet
        const frames = [];
        const cols = Math.floor(this.sprite.width / this.frameWidth);
        const rows = Math.floor(this.sprite.height / this.frameHeight);
        for (let y = 0; y < rows; ++y) {
            for (let x = 0; x < cols; ++x) {
                frames.push({ x: x * this.frameWidth, y: y * this.frameHeight });
            }
        }
        return frames;
    }

    play() { this.playing = true; }
    pause() { this.playing = false; }
    stop() { this.playing = false; this.current = 0; this.timer = 0; }

    update(dt) {
        if (!this.playing || this.frames.length <= 1) return;
        this.timer += dt;
        const frameTime = 1 / this.fps;
        while (this.timer >= frameTime) {
            this.timer -= frameTime;
            this.current++;
            if (this.current >= this.frames.length) {
                if (this.loop) this.current = 0;
                else { this.current = this.frames.length - 1; this.playing = false; }
            }
        }
    }

    render(ctx, x, y, options = {}) {
        const frame = this.frames[this.current];
        ctx.save();
        ctx.globalAlpha = options.alpha !== undefined ? options.alpha : 1.0;
        ctx.drawImage(
            this.sprite.image,
            frame.x, frame.y,
            this.frameWidth, this.frameHeight,
            x, y,
            this.frameWidth, this.frameHeight
        );
        ctx.restore();
    }
}