/**
 * NeonFrame Physics3D - Quaternion (production-ready)
 */
export class Quaternion {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    set(x, y, z, w) {
        this.x = x; this.y = y; this.z = z; this.w = w;
        return this;
    }

    clone() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    copy(q) {
        this.x = q.x; this.y = q.y; this.z = q.z; this.w = q.w;
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    normalize() {
        const l = this.length();
        if (l === 0) return this;
        const il = 1 / l;
        this.x *= il; this.y *= il; this.z *= il; this.w *= il;
        return this;
    }

    multiply(q) {
        // In-place multiplication: this = this * q
        const ax = this.x, ay = this.y, az = this.z, aw = this.w;
        const bx = q.x, by = q.y, bz = q.z, bw = q.w;
        this.x = aw * bx + ax * bw + ay * bz - az * by;
        this.y = aw * by - ax * bz + ay * bw + az * bx;
        this.z = aw * bz + ax * by - ay * bx + az * bw;
        this.w = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    }

    multiplied(q) {
        // Returns a new quaternion: result = this * q
        const ax = this.x, ay = this.y, az = this.z, aw = this.w;
        const bx = q.x, by = q.y, bz = q.z, bw = q.w;
        return new Quaternion(
            aw * bx + ax * bw + ay * bz - az * by,
            aw * by - ax * bz + ay * bw + az * bx,
            aw * bz + ax * by - ay * bx + az * bw,
            aw * bw - ax * bx - ay * by - az * bz
        );
    }

    setFromAxisAngle(axis, angle) {
        const half = angle / 2, s = Math.sin(half);
        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = Math.cos(half);
        return this;
    }

    conjugate() {
        return new Quaternion(-this.x, -this.y, -this.z, this.w);
    }

    rotateVector3(v) {
        // v' = q * [v,0] * q^-1
        const qv = new Quaternion(v.x, v.y, v.z, 0);
        const inv = this.clone().conjugate().normalize();
        const qr = this.clone().multiplied(qv).multiplied(inv);
        return { x: qr.x, y: qr.y, z: qr.z };
    }

    toMatrix4() {
        const x = this.x, y = this.y, z = this.z, w = this.w;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        return [
            1 - (yy + zz), xy + wz,     xz - wy,     0,
            xy - wz,       1 - (xx + zz), yz + wx,   0,
            xz + wy,       yz - wx,     1 - (xx + yy), 0,
            0,             0,           0,           1
        ];
    }

    static fromAxisAngle(axis, angle) {
        return new Quaternion().setFromAxisAngle(axis, angle);
    }
}