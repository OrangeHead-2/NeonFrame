/**
 * NeonFrame Physics3D - Matrix4 (4x4) for 3D transforms
 */
export class Matrix4 {
    constructor() {
        this.m = new Float32Array(16);
        this.identity();
    }
    identity() {
        const m = this.m;
        m[0] = 1; m[1] = 0; m[2] = 0; m[3] = 0;
        m[4] = 0; m[5] = 1; m[6] = 0; m[7] = 0;
        m[8] = 0; m[9] = 0; m[10] = 1; m[11] = 0;
        m[12] = 0; m[13] = 0; m[14] = 0; m[15] = 1;
        return this;
    }
    copy(mat) {
        for (let i = 0; i < 16; ++i) this.m[i] = mat.m[i];
        return this;
    }
    setPosition(x, y, z) {
        this.m[12] = x; this.m[13] = y; this.m[14] = z;
        return this;
    }
    setRotationFromQuaternion(q) {
        const m = this.m;
        const x = q.x, y = q.y, z = q.z, w = q.w;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        m[0] = 1 - (yy + zz);
        m[1] = xy + wz;
        m[2] = xz - wy;
        m[3] = 0;
        m[4] = xy - wz;
        m[5] = 1 - (xx + zz);
        m[6] = yz + wx;
        m[7] = 0;
        m[8] = xz + wy;
        m[9] = yz - wx;
        m[10] = 1 - (xx + yy);
        m[11] = 0;
        // position is unchanged
        return this;
    }
    multiply(matB) {
        const a = this.m, b = matB.m, r = new Float32Array(16);
        for (let i = 0; i < 4; ++i)
            for (let j = 0; j < 4; ++j)
                r[i + j * 4] = a[0 + j * 4] * b[i + 0 * 4] +
                               a[1 + j * 4] * b[i + 1 * 4] +
                               a[2 + j * 4] * b[i + 2 * 4] +
                               a[3 + j * 4] * b[i + 3 * 4];
        this.m = r;
        return this;
    }
    clone() {
        const m = new Matrix4();
        m.copy(this);
        return m;
    }
}