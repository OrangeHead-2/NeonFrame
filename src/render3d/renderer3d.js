/**
 * NeonFrame 3D Renderer
 * High-level draw API: render mesh/material with camera and transform.
 */
export class Renderer3D {
  constructor(canvas) {
    const { WebGLContext3D } = require("./webgl-context.js");
    this.ctx = new WebGLContext3D(canvas);
    this.gl = this.ctx.gl;
  }

  clear(r = 0, g = 0, b = 0, a = 1) {
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  renderMesh(mesh, material, camera, modelMatrix) {
    const gl = this.gl;
    material.apply(gl);
    // Set camera uniforms if present
    const projLoc = material.shader.getUniform("u_projection");
    if (projLoc !== null && projLoc !== -1)
      gl.uniformMatrix4fv(projLoc, false, camera.projectionMatrix.m);
    const viewLoc = material.shader.getUniform("u_view");
    if (viewLoc !== null && viewLoc !== -1)
      gl.uniformMatrix4fv(viewLoc, false, camera.viewMatrix.m);
    const modelLoc = material.shader.getUniform("u_model");
    if (modelLoc !== null && modelLoc !== -1)
      gl.uniformMatrix4fv(modelLoc, false, modelMatrix.m);
    mesh.bindAttribs(material.shader);
    mesh.draw();
  }
}