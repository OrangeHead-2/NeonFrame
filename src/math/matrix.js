/**
 * NeonFrame Math - 3x3 Matrix for 2D transforms
 */
export class Matrix {
    constructor() {
        this.m = [1, 0, 0,
                  0, 1, 0,
                  0, 0, 1];
    }
    set(m) {
        for (let i = 0; i < 9; i++) this.m[i] = m[i];
        return this;
    }
    identity() {
        this.m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        return this;
    }
    translate(x, y) {
        this.m[6] += x;
        this.m[7] += y;
        return this;
    }
    scale(x, y) {
        this.m[0] *= x;
        this.m[4] *= y;
        return this;
    }
    rotate(rad) {
        const c = Math.cos(rad), s = Math.sin(rad);
        const m0 = this.m[0], m1 = this.m[1], m3 = this.m[3], m4 = this.m[4];
        this.m[0] = m0 * c + m3 * s;
        this.m[1] = m1 * c + m4 * s;
        this.m[3] = m0 * -s + m3 * c;
        this.m[4] = m1 * -s + m4 * c;
        return this;
    }
    multiply(b) {
        const a = this.m, m = [];
        for (let row = 0; row < 3; ++row) {
            for (let col = 0; col < 3; ++col) {
                m[row * 3 + col] =
                    a[row * 3 + 0] * b.m[0 * 3 + col] +
                    a[row * 3 + 1] * b.m[1 * 3 + col] +
                    a[row * 3 + 2] * b.m[2 * 3 + col];
            }
        }
        this.m = m;
        return this;
    }
    clone() {
        const mat = new Matrix();
        mat.set(this.m);
        return mat;
    }
}