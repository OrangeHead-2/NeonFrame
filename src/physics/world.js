/**
 * NeonFrame Physics - Physics World
 */
import { Collision } from '../math/collision.js';

export class World {
    constructor(options = {}) {
        this.bodies = [];
        this.gravity = options.gravity !== undefined ? options.gravity : 500;
        this.bounds = options.bounds || null; // {x, y, width, height}
        this.collisions = [];
    }

    addBody(body) {
        this.bodies.push(body);
    }

    removeBody(body) {
        this.bodies = this.bodies.filter(b => b !== body);
    }

    update(dt) {
        // Apply gravity
        for (const body of this.bodies) {
            if (!body.fixed) {
                body.applyForce({ x: 0, y: body.mass * this.gravity });
            }
        }
        // Update bodies
        for (const body of this.bodies) {
            body.update(dt);
            // Bounds check
            if (this.bounds) {
                if (body.position.x < this.bounds.x) body.position.x = this.bounds.x;
                if (body.position.y < this.bounds.y) body.position.y = this.bounds.y;
                if (body.position.x + body.width > this.bounds.x + this.bounds.width)
                    body.position.x = this.bounds.x + this.bounds.width - body.width;
                if (body.position.y + body.height > this.bounds.y + this.bounds.height)
                    body.position.y = this.bounds.y + this.bounds.height - body.height;
            }
        }
        // Collision detection and resolution (basic AABB)
        this.collisions = [];
        for (let i = 0; i < this.bodies.length; ++i) {
            for (let j = i + 1; j < this.bodies.length; ++j) {
                const a = this.bodies[i], b = this.bodies[j];
                if (a.shape === 'rect' && b.shape === 'rect' && Collision.aabb(a.getAABB(), b.getAABB())) {
                    this.resolveCollision(a, b);
                    this.collisions.push([a, b]);
                }
            }
        }
    }

    resolveCollision(a, b) {
        // Simple elastic collision response for rectangles
        if (a.fixed && b.fixed) return;
        // Separate bodies
        const overlapX = Math.min(a.position.x + a.width, b.position.x + b.width) -
                         Math.max(a.position.x, b.position.x);
        const overlapY = Math.min(a.position.y + a.height, b.position.y + b.height) -
                         Math.max(a.position.y, b.position.y);
        if (overlapX < overlapY) {
            if (!a.fixed) a.position.x -= overlapX / 2;
            if (!b.fixed) b.position.x += overlapX / 2;
            [a.velocity.x, b.velocity.x] = [b.velocity.x * b.restitution, a.velocity.x * a.restitution];
        } else {
            if (!a.fixed) a.position.y -= overlapY / 2;
            if (!b.fixed) b.position.y += overlapY / 2;
            [a.velocity.y, b.velocity.y] = [b.velocity.y * b.restitution, a.velocity.y * a.restitution];
        }
    }
}