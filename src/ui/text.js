/**
 * NeonFrame UI - Text
 */
export class Text {
    constructor(x, y, content, options = {}) {
        this.x = x;
        this.y = y;
        this.content = content;
        this.font = options.font || '18px monospace';
        this.color = options.color || '#fff';
        this.align = options.align || 'left';
        this.alpha = options.alpha !== undefined ? options.alpha : 1.0;
        this.visible = true;
    }

    setContent(str) {
        this.content = str;
    }

    render(ctx) {
        if (!this.visible) return;
        ctx.save();
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.textAlign = this.align;
        ctx.fillText(this.content, this.x, this.y);
        ctx.restore();
    }
}