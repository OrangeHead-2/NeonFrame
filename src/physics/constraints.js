/**
 * NeonFrame Physics - Constraints (distance, fixed, etc)
 */
import { Vector2 } from '../math/vector2.js';

export class Constraint {
    constructor(bodyA, bodyB, length = null) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;
        this.length = length !== null ? length : bodyA.position.distanceTo(bodyB.position);
        this.stiffness = 1.0;
    }

    solve() {
        const delta = this.bodyB.position.clone().subtract(this.bodyA.position);
        const dist = delta.length();
        if (dist === 0) return;
        const diff = (dist - this.length) / dist;
        const correction = delta.clone().multiplyScalar(0.5 * diff * this.stiffness);
        if (!this.bodyA.fixed) this.bodyA.position.add(correction);
        if (!this.bodyB.fixed) this.bodyB.position.subtract(correction);
    }
}