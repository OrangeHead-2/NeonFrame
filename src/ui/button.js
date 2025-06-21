/**
 * NeonFrame UI - Button
 */
export class Button {
    constructor(x, y, width, height, text, onClick) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.onClick = onClick;
        this.hovered = false;
        this.pressed = false;
        this.visible = true;
    }

    update(input) {
        if (!this.visible) return;
        const mx = input.mouse.x;
        const my = input.mouse.y;
        this.hovered =
            mx >= this.x && mx <= this.x + this.width &&
            my >= this.y && my <= this.y + this.height;
        if (this.hovered && input.mouse.pressed) {
            this.pressed = true;
        }
        if (this.pressed && !input.mouse.down) {
            this.pressed = false;
            if (this.hovered && this.onClick) this.onClick();
        }
    }

    render(ctx) {
        if (!this.visible) return;
        ctx.save();
        ctx.fillStyle = this.hovered ? '#ff0' : '#888';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#222';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        ctx.restore();
    }
}