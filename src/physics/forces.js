/**
 * NeonFrame Physics - Common Forces
 */
import { Vector2 } from '../math/vector2.js';

export const Forces = {
    gravity: (body, value = 9.8) => {
        if (!body.fixed) {
            body.applyForce(new Vector2(0, body.mass * value));
        }
    },
    drag: (body, coefficient = 0.1) => {
        if (!body.fixed) {
            body.applyForce(
                new Vector2(-body.velocity.x * coefficient, -body.velocity.y * coefficient)
            );
        }
    },
    impulse: (body, forceVec) => {
        if (!body.fixed) {
            body.velocity.add(forceVec.clone().multiplyScalar(1 / body.mass));
        }
    }
};