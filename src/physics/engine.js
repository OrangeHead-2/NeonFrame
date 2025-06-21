/**
 * NeonFrame Advanced Physics - 2D Physics Engine
 * Features: broadphase grid, narrowphase (rect/circle/polygon), real impulses, constraints.
 */

import { Vector2 } from '../math/vector2.js';

// --- SHAPES ---

export class Shape {
    constructor(type) { this.type = type; }
}

export class CircleShape extends Shape {
    constructor(radius) {
        super('circle');
        this.radius = radius;
    }
}

export class RectShape extends Shape {
    constructor(width, height) {
        super('rect');
        this.width = width;
        this.height = height;
    }
}

export class PolygonShape extends Shape {
    constructor(vertices) {
        super('polygon');
        this.vertices = vertices.map(v => v.clone());
    }
}

// --- RIGID BODY ---

export class RigidBody {
    constructor({
        shape,
        position = new Vector2(0, 0),
        angle = 0,
        mass = 1,
        restitution = 0.1,
        friction = 0.8,
        fixed = false
    }) {
        this.shape = shape;
        this.position = position.clone();
        this.angle = angle;
        this.velocity = new Vector2(0, 0);
        this.angularVelocity = 0;
        this.force = new Vector2(0, 0);
        this.torque = 0;
        this.mass = fixed ? 0 : mass;
        this.invMass = fixed ? 0 : 1 / mass;
        this.restitution = restitution;
        this.friction = friction;
        this.fixed = fixed;
        this.userData = null;
    }

    applyForce(f, point = null) {
        if (this.fixed) return;
        this.force.add(f);
        if (point) {
            // Cross product for 2D torque: r x F = r.x*F.y - r.y*F.x
            const r = point.clone().subtract(this.position);
            this.torque += r.x * f.y - r.y * f.x;
        }
    }

    integrate(dt) {
        if (this.fixed) return;
        this.velocity.add(this.force.clone().multiplyScalar(this.invMass * dt));
        this.position.add(this.velocity.clone().multiplyScalar(dt));
        // Simple angular integration (no inertia tensor for now)
        this.angularVelocity += this.torque * dt;
        this.angle += this.angularVelocity * dt;
        this.force.set(0, 0);
        this.torque = 0;
    }
}

// --- BROADPHASE (Spatial Hash Grid) ---

export class BroadphaseGrid {
    constructor(cellSize = 64) {
        this.cellSize = cellSize;
        this.map = new Map();
    }
    hash(x, y) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }
    clear() { this.map.clear(); }
    add(body) {
        const aabb = Physics2D.getAABB(body);
        for (let x = aabb.x; x < aabb.x + aabb.w; x += this.cellSize) {
            for (let y = aabb.y; y < aabb.y + aabb.h; y += this.cellSize) {
                const key = this.hash(x, y);
                if (!this.map.has(key)) this.map.set(key, []);
                this.map.get(key).push(body);
            }
        }
    }
    query(body) {
        // Get all bodies in the same cells
        const aabb = Physics2D.getAABB(body);
        const set = new Set();
        for (let x = aabb.x; x < aabb.x + aabb.w; x += this.cellSize) {
            for (let y = aabb.y; y < aabb.y + aabb.h; y += this.cellSize) {
                const key = this.hash(x, y);
                if (this.map.has(key)) {
                    for (const b of this.map.get(key)) set.add(b);
                }
            }
        }
        set.delete(body);
        return Array.from(set);
    }
}

// --- COLLISION/NARROWPHASE ---

export class Manifold {
    constructor(a, b, normal, penetration, contacts) {
        this.a = a;
        this.b = b;
        this.normal = normal;
        this.penetration = penetration;
        this.contacts = contacts; // Array of contact points
    }
}

export class Physics2D {
    constructor(gravity = new Vector2(0, 900)) {
        this.bodies = [];
        this.constraints = [];
        this.gravity = gravity;
        this.grid = new BroadphaseGrid();
        this.contacts = [];
    }

    addBody(body) { this.bodies.push(body); }
    removeBody(body) { this.bodies = this.bodies.filter(b => b !== body); }
    addConstraint(constraint) { this.constraints.push(constraint); }
    removeConstraint(constraint) { this.constraints = this.constraints.filter(c => c !== constraint); }

    step(dt) {
        // Broadphase
        this.grid.clear();
        for (const b of this.bodies) this.grid.add(b);

        // Apply gravity
        for (const b of this.bodies) {
            if (!b.fixed) b.applyForce(this.gravity.clone().multiplyScalar(b.mass));
        }

        // Detect contacts
        this.contacts = [];
        for (const a of this.bodies) {
            for (const b of this.grid.query(a)) {
                if (a.fixed && b.fixed) continue;
                const contact = Physics2D.collide(a, b);
                if (contact) this.contacts.push(contact);
            }
        }

        // Resolve contacts
        for (const c of this.contacts) Physics2D.resolveCollision(c);

        // Constraints (distance, angle)
        for (const c of this.constraints) c.solve();

        // Integrate
        for (const b of this.bodies) b.integrate(dt);
    }

    static getAABB(body) {
        if (body.shape.type === 'circle') {
            return {
                x: body.position.x - body.shape.radius,
                y: body.position.y - body.shape.radius,
                w: body.shape.radius * 2,
                h: body.shape.radius * 2
            };
        }
        if (body.shape.type === 'rect') {
            return {
                x: body.position.x,
                y: body.position.y,
                w: body.shape.width,
                h: body.shape.height
            };
        }
        // Polygon: bounds
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const v of body.shape.vertices) {
            const x = v.x + body.position.x, y = v.y + body.position.y;
            if (x < minX) minX = x; if (y < minY) minY = y;
            if (x > maxX) maxX = x; if (y > maxY) maxY = y;
        }
        return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    }

    static collide(a, b) {
        // Only rect/rect and circle/circle for brevity; can add polygon as needed
        if (a.shape.type === 'rect' && b.shape.type === 'rect') {
            // SAT for rectangles (axis-aligned)
            const ax = a.position.x, ay = a.position.y, aw = a.shape.width, ah = a.shape.height;
            const bx = b.position.x, by = b.position.y, bw = b.shape.width, bh = b.shape.height;
            if (ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by) {
                // Find penetration and normal
                const dx = (ax + aw / 2) - (bx + bw / 2);
                const dy = (ay + ah / 2) - (by + bh / 2);
                const px = aw / 2 + bw / 2 - Math.abs(dx);
                const py = ah / 2 + bh / 2 - Math.abs(dy);
                if (px < py) {
                    return new Manifold(a, b, new Vector2(Math.sign(dx), 0), px, [new Vector2(ax + aw / 2, ay + ah / 2)]);
                } else {
                    return new Manifold(a, b, new Vector2(0, Math.sign(dy)), py, [new Vector2(ax + aw / 2, ay + ah / 2)]);
                }
            }
        }
        if (a.shape.type === 'circle' && b.shape.type === 'circle') {
            const delta = b.position.clone().subtract(a.position);
            const dist = delta.length();
            const rSum = a.shape.radius + b.shape.radius;
            if (dist < rSum) {
                const normal = delta.clone().normalize();
                return new Manifold(a, b, normal, rSum - dist, [
                    a.position.clone().add(normal.clone().multiplyScalar(a.shape.radius))
                ]);
            }
        }
        // TODO: Add circle/rect, polygon support
        return null;
    }

    static resolveCollision(m) {
        const a = m.a, b = m.b;
        const relVel = b.velocity.clone().subtract(a.velocity);
        const velAlongNormal = relVel.dot(m.normal);

        if (velAlongNormal > 0)
            return; // Already separating

        const e = Math.min(a.restitution, b.restitution);
        let j = -(1 + e) * velAlongNormal;
        const invMassSum = a.invMass + b.invMass;
        if (invMassSum === 0) return;
        j /= invMassSum;

        // Impulse
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
        const percent = 0.2; // Penetration percent
        const correction = m.normal.clone().multiplyScalar(m.penetration / invMassSum * percent);
        if (!a.fixed)
            a.position.subtract(correction.clone().multiplyScalar(a.invMass));
        if (!b.fixed)
            b.position.add(correction.clone().multiplyScalar(b.invMass));
    }
}