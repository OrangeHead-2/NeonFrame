/**
 * NeonFrame Physics3D - PhysicsWorld3D
 */
import { Vector3 } from '../math/vector3.js';
import { Physics3D } from './engine.js';

export class PhysicsWorld3D {
    constructor(gravity = new Vector3(0, -9.8, 0)) {
        this.bodies = [];
        this.constraints = [];
        this.gravity = gravity;
        this.contacts = [];
    }

    addBody(body) { this.bodies.push(body); }
    removeBody(body) { this.bodies = this.bodies.filter(b => b !== body); }
    addConstraint(constraint) { this.constraints.push(constraint); }
    removeConstraint(constraint) { this.constraints = this.constraints.filter(c => c !== constraint); }

    step(dt) {
        // Apply gravity
        for (const b of this.bodies) {
            if (!b.fixed) b.applyForce(this.gravity.clone().multiplyScalar(b.mass));
        }

        // Broadphase: sweep-and-prune on X
        const bodies = this.bodies.slice().sort((a, b) => Physics3D.getAABB(a).x - Physics3D.getAABB(b).x);

        // Detect contacts (narrowphase)
        this.contacts = [];
        for (let i = 0; i < bodies.length; ++i) {
            for (let j = i + 1; j < bodies.length; ++j) {
                const a = bodies[i], b = bodies[j];
                if (Physics3D.aabbOverlap(a, b)) {
                    const contact = Physics3D.collide(a, b);
                    if (contact) this.contacts.push(contact);
                }
            }
        }

        // Resolve contacts
        for (const c of this.contacts) Physics3D.resolveCollision(c);

        // Constraints
        for (const c of this.constraints) c.solve();

        // Integrate
        for (const b of this.bodies) b.integrate(dt);
    }
}