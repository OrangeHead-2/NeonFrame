/**
 * NeonFrame UI - Menu (vertical list of buttons)
 */
import { Button } from './button.js';

export class Menu {
    constructor(x, y, items = []) {
        this.x = x;
        this.y = y;
        this.items = [];
        this.spacing = 40;
        this.visible = true;
        this.setItems(items);
    }

    setItems(items) {
        this.items = items.map((item, i) =>
            new Button(
                this.x,
                this.y + i * this.spacing,
                item.width || 180,
                item.height || 32,
                item.text,
                item.onClick
            )
        );
    }

    update(input) {
        if (!this.visible) return;
        for (const btn of this.items) btn.update(input);
    }

    render(ctx) {
        if (!this.visible) return;
        for (const btn of this.items) btn.render(ctx);
    }
}