/**
 * NeonFrame WebGLContext - Safely handles WebGL context creation and state
 */
export class WebGLContext {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2', options) ||
                  canvas.getContext('webgl', options) ||
                  canvas.getContext('experimental-webgl', options);
        if (!this.gl) throw new Error('WebGL not supported!');
    }
}