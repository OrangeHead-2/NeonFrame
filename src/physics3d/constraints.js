/**
 * NeonFrame Physics3D - Constraints
 */
import { Vector3 } from '../math/vector3.js';

export class DistanceConstraint3D {
    constructor(a, b, length = null, stiffness = 1.0) {
        this.a = a; this.b = b;
        this.length = length !== null ? length : a.position.distanceTo(b.position);
        this.stiffness = stiffness;
    }
    solve() {
        const delta = this.b.position.clone().subtract(this.a.position);
        const dist = delta.length();
        if (dist === 0) return;
        const diff = (dist - this.length) / dist;
        const correction = delta.clone().multiplyScalar(0.5 * diff * this.stiffness);
        if (!this.a.fixed) this.a.position.add(correction);
        if (!this.b.fixed) this.b.position.subtract(correction);
    }
}

export class FixedConstraint3D {
    constructor(body, point) {
        this.body = body;
        this.point = point.clone();
    }
    solve() {
        if (!this.body.fixed) {
            this.body.position.copy(this.point);
            this.body.velocity.set(0, 0, 0);
        }
    }
}