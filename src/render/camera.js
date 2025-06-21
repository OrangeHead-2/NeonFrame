/**
 * NeonFrame Camera - Handles view transforms and following targets
 */
import { Vector2 } from '../math/vector2.js';

export class Camera {
    constructor(width, height) {
        this.position = new Vector2(0, 0);
        this.width = width;
        this.height = height;
        this.target = null;
    }

    follow(target) {
        this.target = target;
    }

    update(dt) {
        if (this.target && this.target.position) {
            this.position.x = this.target.position.x - this.width / 2;
            this.position.y = this.target.position.y - this.height / 2;
        }
    }

    apply(ctx) {
        ctx.save();
        ctx.translate(-this.position.x, -this.position.y);
    }

    reset(ctx) {
        ctx.restore();
    }
}