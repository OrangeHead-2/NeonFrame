/**
 * NeonFrame Physics3D - Shapes3D
 */
import { Vector3 } from '../math/vector3.js';

export class SphereShape {
    constructor(radius) {
        this.type = 'sphere';
        this.radius = radius;
    }
}

export class BoxShape {
    constructor(width, height, depth) {
        this.type = 'box';
        this.width = width;
        this.height = height;
        this.depth = depth;
    }
}

export class PlaneShape {
    constructor(normal = new Vector3(0, 1, 0), offset = 0) {
        this.type = 'plane';
        this.normal = normal.clone();
        this.offset = offset;
    }
}