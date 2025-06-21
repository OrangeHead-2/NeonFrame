/**
 * NeonFrame Utils - Debug overlay
 */
export class Debug {
    constructor() {
        this.lines = [];
        this.visible = true;
    }

    log(msg) {
        this.lines.push(msg);
        if (this.lines.length > 8) this.lines.shift();
    }

    render(ctx) {
        if (!this.visible) return;
        ctx.save();
        ctx.font = '13px monospace';
        ctx.fillStyle = '#0f0';
        ctx.globalAlpha = 0.9;
        this.lines.forEach((line, i) => {
            ctx.fillText(line, 6, 16 + i * 16);
        });
        ctx.restore();
    }
}