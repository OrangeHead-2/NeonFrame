/**
 * NeonFrame WebGLShader - Compiles, links, and manages shaders
 */
export class WebGLShader {
    constructor(gl, vertSrc, fragSrc) {
        this.gl = gl;
        this.program = this._createProgram(vertSrc, fragSrc);
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
            throw new Error('WebGL program linking failed: ' + gl.getProgramInfoLog(prog));
        }
        return prog;
    }
    _compile(type, src) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error('WebGL shader compile failed: ' + gl.getShaderInfoLog(shader));
        }
        return shader;
    }
    use() { this.gl.useProgram(this.program); }
    getAttrib(name) { return this.gl.getAttribLocation(this.program, name); }
    getUniform(name) { return this.gl.getUniformLocation(this.program, name); }
}