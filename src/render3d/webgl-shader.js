/**
 * NeonFrame 3D WebGL Shader
 * Compiles and links GLSL vertex and fragment shaders.
 */
export class WebGLShader3D {
  constructor(gl, vertexSource, fragmentSource) {
    this.gl = gl;
    this.program = this._createProgram(vertexSource, fragmentSource);
  }
  _compile(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(
        (type === gl.VERTEX_SHADER ? "Vertex" : "Fragment") +
          " shader error: " +
          gl.getShaderInfoLog(shader)
      );
    }
    return shader;
  }
  _createProgram(vsSource, fsSource) {
    const gl = this.gl;
    const vs = this._compile(gl.VERTEX_SHADER, vsSource);
    const fs = this._compile(gl.FRAGMENT_SHADER, fsSource);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error("Shader program link error: " + gl.getProgramInfoLog(prog));
    }
    return prog;
  }
  use() {
    this.gl.useProgram(this.program);
  }
  getAttrib(name) {
    return this.gl.getAttribLocation(this.program, name);
  }
  getUniform(name) {
    return this.gl.getUniformLocation(this.program, name);
  }
}