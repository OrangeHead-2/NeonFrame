/**
 * NeonFrame Math - Collision detection helpers
 */
import { Vector2 } from './vector2.js';

export class Collision {
    // Axis-Aligned Bounding Box (AABB) collision
    static aabb(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    // Circle vs. Circle collision
    static circle(a, b) {
        const dx = a.x - b.x, dy = a.y - b.y;
        const r = a.radius + b.radius;
        return dx * dx + dy * dy < r * r;
    }

    // Point vs. Rect
    static pointRect(point, rect) {
        return (
            point.x >= rect.x &&
            point.x <= rect.x + rect.width &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.height
        );
    }

    // Line vs. Line (returns intersection point or false)
    static lineLine(a1, a2, b1, b2) {
        const dx1 = a2.x - a1.x, dy1 = a2.y - a1.y;
        const dx2 = b2.x - b1.x, dy2 = b2.y - b1.y;
        const denominator = dx1 * dy2 - dy1 * dx2;
        if (denominator === 0) return false; // Parallel

        const ua = ((b1.x - a1.x) * dy2 - (b1.y - a1.y) * dx2) / denominator;
        const ub = ((b1.x - a1.x) * dy1 - (b1.y - a1.y) * dx1) / denominator;
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            return new Vector2(
                a1.x + ua * dx1,
                a1.y + ua * dy1
            );
        }
        return false;
    }
}