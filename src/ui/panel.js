/**
 * NeonFrame UI - Panel
 */
export class Panel {
    constructor(x, y, width, height, color = '#444', alpha = 0.8) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alpha = alpha;
        this.visible = true;
    }

    render(ctx) {
        if (!this.visible) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}