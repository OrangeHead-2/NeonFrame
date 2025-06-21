/**
 * NeonFrame 3D PBR Material (Metallic-Roughness workflow)
 */
export class PBRMaterial3D {
  constructor(shader, options = {}) {
    this.shader = shader;
    this.uniforms = {
      u_baseColor: options.baseColor || [1, 1, 1, 1],
      u_metallic: options.metallic ?? 0.0,
      u_roughness: options.roughness ?? 1.0,
      u_baseColorMap: options.baseColorMap || null,
      u_normalMap: options.normalMap || null,
      u_metallicRoughnessMap: options.metallicRoughnessMap || null,
      u_envMap: options.envMap || null,
      ...options.uniforms
    };
  }

  setUniform(name, value) {
    this.uniforms[name] = value;
  }

  apply(gl) {
    this.shader.use();
    for (const [name, value] of Object.entries(this.uniforms)) {
      const loc = this.shader.getUniform(name);
      if (loc === null || loc === -1) continue;
      if (name.endsWith("Map") && value) {
        const texUnit = 0; // Assumes single texture for brevity, extend as needed
        gl.activeTexture(gl.TEXTURE0 + texUnit);
        gl.bindTexture(gl.TEXTURE_2D, value);
        gl.uniform1i(loc, texUnit);
      } else if (typeof value === "number") {
        gl.uniform1f(loc, value);
      } else if (Array.isArray(value) && value.length === 4) {
        gl.uniform4fv(loc, value);
      } else if (Array.isArray(value) && value.length === 3) {
        gl.uniform3fv(loc, value);
      }
    }
  }
}