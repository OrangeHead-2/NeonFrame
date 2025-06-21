/**
 * NeonFrame Math - 3D Vector
 */
export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(x, y, z) {
        this.x = x; this.y = y; this.z = z; return this;
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    copy(v) {
        this.x = v.x; this.y = v.y; this.z = v.z; return this;
    }
    add(v) {
        this.x += v.x; this.y += v.y; this.z += v.z; return this;
    }
    subtract(v) {
        this.x -= v.x; this.y -= v.y; this.z -= v.z; return this;
    }
    multiplyScalar(s) {
        this.x *= s; this.y *= s; this.z *= s; return this;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
        const l = this.length();
        if (l > 0) {
            this.x /= l; this.y /= l; this.z /= l;
        }
        return this;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v) {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }
    distanceTo(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    equals(v) {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }
    static add(a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    static subtract(a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static zero() {
        return new Vector3(0, 0, 0);
    }
    static one() {
        return new Vector3(1, 1, 1);
    }
}