/**
 * NeonFrame Physics3D - Collision and Resolution
 */
import { Vector3 } from '../math/vector3.js';

export class Manifold3D {
    constructor(a, b, normal, penetration, contactPoint) {
        this.a = a;
        this.b = b;
        this.normal = normal;
        this.penetration = penetration;
        this.contactPoint = contactPoint;
    }
}

export class Physics3D {
    static getAABB(body) {
        if (body.shape.type === 'sphere') {
            return {
                x: body.position.x - body.shape.radius,
                y: body.position.y - body.shape.radius,
                z: body.position.z - body.shape.radius,
                w: body.shape.radius * 2,
                h: body.shape.radius * 2,
                d: body.shape.radius * 2
            };
        }
        if (body.shape.type === 'box') {
            return {
                x: body.position.x,
                y: body.position.y,
                z: body.position.z,
                w: body.shape.width,
                h: body.shape.height,
                d: body.shape.depth
            };
        }
        return { x: -Infinity, y: -Infinity, z: -Infinity, w: Infinity, h: Infinity, d: Infinity };
    }

    static aabbOverlap(a, b) {
        const A = Physics3D.getAABB(a), B = Physics3D.getAABB(b);
        return (
            A.x < B.x + B.w && A.x + A.w > B.x &&
            A.y < B.y + B.h && A.y + A.h > B.y &&
            A.z < B.z + B.d && A.z + A.d > B.z
        );
    }

    static collide(a, b) {
        // Sphere-sphere
        if (a.shape.type === 'sphere' && b.shape.type === 'sphere') {
            const delta = b.position.clone().subtract(a.position);
            const dist = delta.length();
            const rSum = a.shape.radius + b.shape.radius;
            if (dist < rSum) {
                const normal = delta.clone().normalize();
                return new Manifold3D(a, b, normal, rSum - dist, a.position.clone().add(normal.clone().multiplyScalar(a.shape.radius)));
            }
        }
        // Sphere-plane
        if (a.shape.type === 'sphere' && b.shape.type === 'plane') {
            const rel = a.position.dot(b.shape.normal) - b.shape.offset;
            if (rel < a.shape.radius) {
                const normal = b.shape.normal.clone();
                return new Manifold3D(a, b, normal, a.shape.radius - rel, a.position.clone().subtract(normal.clone().multiplyScalar(rel)));
            }
        }
        if (a.shape.type === 'plane' && b.shape.type === 'sphere') {
            return Physics3D.collide(b, a);
        }
        return null;
    }

    static resolveCollision(m) {
        const a = m.a, b = m.b;
        const relVel = b.velocity.clone().subtract(a.velocity);
        const velAlongNormal = relVel.dot(m.normal);

        if (velAlongNormal > 0) return;

        const e = Math.min(a.restitution, b.restitution);
        let j = -(1 + e) * velAlongNormal;
        const invMassSum = a.invMass + b.invMass;
        if (invMassSum === 0) return;
        j /= invMassSum;

        const impulse = m.normal.clone().multiplyScalar(j);
        if (!a.fixed)
            a.velocity.subtract(impulse.clone().multiplyScalar(a.invMass));
        if (!b.fixed)
            b.velocity.add(impulse.clone().multiplyScalar(b.invMass));

        // Friction
        const tangent = relVel.clone().subtract(m.normal.clone().multiplyScalar(velAlongNormal)).normalize();
        const mu = Math.sqrt(a.friction * b.friction);
        let jt = -relVel.dot(tangent);
        jt /= invMassSum;
        const frictionImpulse = tangent.multiplyScalar(Math.abs(jt) < j * mu ? jt : -j * mu);

        if (!a.fixed)
            a.velocity.subtract(frictionImpulse.clone().multiplyScalar(a.invMass));
        if (!b.fixed)
            b.velocity.add(frictionImpulse.clone().multiplyScalar(b.invMass));

        // Positional correction
        const percent = 0.2;
        const correction = m.normal.clone().multiplyScalar(m.penetration / invMassSum * percent);
        if (!a.fixed)
            a.position.subtract(correction.clone().multiplyScalar(a.invMass));
        if (!b.fixed)
            b.position.add(correction.clone().multiplyScalar(b.invMass));
    }
}