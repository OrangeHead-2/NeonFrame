/**
 * NeonFrame Renderer - Main rendering manager
 * Uses Canvas2D, but can be extended for WebGL.
 */
export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear(color = '#222') {
        const { canvas } = this.ctx;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.ctx.restore();
    }

    drawSprite(sprite, x, y, options = {}) {
        if (!sprite || !sprite.image) return;
        this.ctx.save();
        this.ctx.globalAlpha = options.alpha !== undefined ? options.alpha : 1.0;
        if (options.rotation) {
            this.ctx.translate(x + sprite.width/2, y + sprite.height/2);
            this.ctx.rotate(options.rotation);
            this.ctx.drawImage(
                sprite.image,
                -sprite.width/2, -sprite.height/2,
                sprite.width, sprite.height
            );
        } else {
            this.ctx.drawImage(
                sprite.image, x, y,
                sprite.width, sprite.height
            );
        }
        this.ctx.restore();
    }

    drawRect(x, y, width, height, color = '#fff', alpha = 1.0) {
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.restore();
    }

    drawText(text, x, y, options = {}) {
        this.ctx.save();
        this.ctx.font = options.font || '16px sans-serif';
        this.ctx.fillStyle = options.color || '#fff';
        this.ctx.textAlign = options.align || 'left';
        this.ctx.globalAlpha = options.alpha !== undefined ? options.alpha : 1.0;
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }
}