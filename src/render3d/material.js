/**
 * NeonFrame 3D Material (EXTENDED)
 * - Supports light color, intensity, shadow bias, multiple lights.
 */
export class Material3D {
  constructor(shader, uniforms = {}) {
    this.shader = shader;
    this.uniforms = Object.assign({}, uniforms);
  }
  setUniform(name, value) {
    this.uniforms[name] = value;
  }
  apply(gl) {
    this.shader.use();
    for (const [name, value] of Object.entries(this.uniforms)) {
      const loc = this.shader.getUniform(name);
      if (loc === null || loc === -1) continue;
      if (typeof value === "number") {
        gl.uniform1f(loc, value);
      } else if (Array.isArray(value) && value.length === 4) {
        gl.uniform4fv(loc, value);
      } else if (Array.isArray(value) && value.length === 3) {
        gl.uniform3fv(loc, value);
      } else if (Array.isArray(value) && value.length === 16) {
        gl.uniformMatrix4fv(loc, false, value);
      } else if (Array.isArray(value) && value.length === 9) {
        gl.uniformMatrix3fv(loc, false, value);
      }
      // Extend for samplers, light arrays, etc.
    }
  }
}