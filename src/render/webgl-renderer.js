/**
 * NeonFrame WebGLRenderer - 2D Batch Renderer
 */
import { WebGLShader } from './webgl-shader.js';

const DEFAULT_VS = `
attribute vec2 a_position;
attribute vec2 a_texcoord;
uniform vec2 u_resolution;
varying vec2 v_texcoord;
void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texcoord = a_texcoord;
}`;
const DEFAULT_FS = `
precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D u_image;
void main() {
    gl_FragColor = texture2D(u_image, v_texcoord);
}`;

export class WebGLRenderer {
    constructor(canvas, options = {}) {
        this.context = new (require('./webgl-context.js').WebGLContext)(canvas, options);
        this.gl = this.context.gl;
        this.width = canvas.width;
        this.height = canvas.height;
        this._init();
    }
    _init() {
        const gl = this.gl;
        this.shader = new WebGLShader(gl, DEFAULT_VS, DEFAULT_FS);

        // Quad buffer (for sprites)
        this.vertexBuffer = gl.createBuffer();
        this.texcoordBuffer = gl.createBuffer();

        // Set up a one-quad batch for simplicity
        this.vertices = new Float32Array([
            0, 0,   1, 0,   0, 1,
            0, 1,   1, 0,   1, 1
        ]);
        this.texcoords = new Float32Array([
            0, 0,   1, 0,   0, 1,
            0, 1,   1, 0,   1, 1
        ]);
    }
    clear(r=0, g=0, b=0, a=1) {
        const gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    drawSprite(texture, x, y, w, h) {
        const gl = this.gl;
        this.shader.use();

        gl.viewport(0, 0, this.width, this.height);

        gl.uniform2f(this.shader.getUniform('u_resolution'), this.width, this.height);

        // Vertices for this quad
        const verts = new Float32Array([
            x, y,           x+w, y,     x, y+h,
            x, y+h,         x+w, y,     x+w, y+h
        ]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STREAM_DRAW);
        const posLoc = this.shader.getAttrib('a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Texcoords
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.texcoords, gl.STREAM_DRAW);
        const texLoc = this.shader.getAttrib('a_texcoord');
        gl.enableVertexAttribArray(texLoc);
        gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(this.shader.getUniform('u_image'), 0);

        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    createTextureFromImage(img) {
        const gl = this.gl;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        return tex;
    }
}