import { Vector3 } from '../math/vector3.js';
import { Quaternion } from '../math/quaternion.js';

export class RigidBody3D {
    constructor({
        shape,
        position = new Vector3(0, 0, 0),
        orientation = [0, 0, 0, 1],
        velocity = new Vector3(0, 0, 0),
        angularVelocity = new Vector3(0, 0, 0),
        mass = 1,
        restitution = 0.1,
        friction = 0.8,
        fixed = false,
    }) {
        this.shape = shape;
        this.position = position.clone();
        this.orientation = Array.isArray(orientation)
            ? new Quaternion(...orientation)
            : orientation.clone();
        this.velocity = velocity.clone();
        this.angularVelocity = angularVelocity.clone();
        this.mass = fixed ? 0 : mass;
        this.invMass = fixed ? 0 : 1 / mass;
        this.restitution = restitution;
        this.friction = friction;
        this.fixed = fixed;
        this.force = new Vector3(0, 0, 0);
        this.torque = new Vector3(0, 0, 0);
        this.userData = null;
    }

    applyForce(force, point = null) {
        if (this.fixed) return;
        this.force.add(force);
        if (point) {
            const r = point.clone().subtract(this.position);
            this.torque.add(r.cross(force));
        }
    }

    integrate(dt) {
        if (this.fixed) return;
        this.velocity.add(this.force.clone().multiplyScalar(this.invMass * dt));
        this.position.add(this.velocity.clone().multiplyScalar(dt));
        // Angular integration (quaternion, small angle approx)
        if (this.angularVelocity.length() > 0) {
            const w = this.angularVelocity;
            const q = this.orientation;
            // dq/dt = 0.5 * q * omega, omega = (wx, wy, wz, 0)
            const omega = new Quaternion(w.x * dt, w.y * dt, w.z * dt, 0);
            const dq = q.clone().multiply(omega).multiplyScalar(0.5);
            q.x += dq.x;
            q.y += dq.y;
            q.z += dq.z;
            q.w += dq.w;
            q.normalize();
        }
        this.angularVelocity.add(this.torque.clone().multiplyScalar(this.invMass * dt));
        this.force.set(0, 0, 0);
        this.torque.set(0, 0, 0);
    }
}