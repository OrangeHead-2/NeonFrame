/**
 * NeonFrame Input - Keyboard and mouse manager
 */
export class Input {
    constructor(element) {
        this.keys = {};
        this.mouse = {
            x: 0, y: 0,
            down: false,
            pressed: false,
            released: false
        };

        window.addEventListener('keydown', e => { this.keys[e.code] = true; });
        window.addEventListener('keyup', e => { this.keys[e.code] = false; });

        element.addEventListener('mousemove', e => {
            const rect = element.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        element.addEventListener('mousedown', () => {
            this.mouse.down = true;
            this.mouse.pressed = true;
        });
        element.addEventListener('mouseup', () => {
            this.mouse.down = false;
            this.mouse.released = true;
        });
    }

    update() {
        this.mouse.pressed = false;
        this.mouse.released = false;
    }

    isKeyDown(key) {
        return !!this.keys[key];
    }
}