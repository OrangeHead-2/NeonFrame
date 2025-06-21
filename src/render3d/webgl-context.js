/**
 * NeonFrame 3D WebGL Context
 * Initializes and manages a WebGL2 context for 3D rendering.
 */
export class WebGLContext3D {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.gl =
      canvas.getContext("webgl2", options) ||
      canvas.getContext("webgl", options) ||
      canvas.getContext("experimental-webgl", options);
    if (!this.gl) throw new Error("WebGL not supported in this environment.");
    this.width = canvas.width;
    this.height = canvas.height;
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clearDepth(1.0);
  }
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }
}