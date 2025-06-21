/**
 * NeonFrame Physics - Rigid Body
 */
import { Vector2 } from '../math/vector2.js';

export class Body {
    constructor(options = {}) {
        this.position = new Vector2(options.x || 0, options.y || 0);
        this.velocity = new Vector2(options.vx || 0, options.vy || 0);
        this.acceleration = new Vector2(0, 0);
        this.mass = options.mass || 1;
        this.restitution = options.restitution || 0.2;
        this.friction = options.friction || 0.9;
        this.fixed = !!options.fixed;
        this.width = options.width || 32;
        this.height = options.height || 32;
        this.shape = options.shape || 'rect'; // or 'circle'
        this.radius = options.radius || 16;
        this.force = new Vector2(0, 0);
    }

    applyForce(force) {
        if (this.fixed) return;
        this.force.add(force);
    }

    update(dt) {
        if (this.fixed) return;
        this.acceleration.x = this.force.x / this.mass;
        this.acceleration.y = this.force.y / this.mass;
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        // Update position
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        // Reset force
        this.force.set(0, 0);
    }

    getAABB() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height
        };
    }
}