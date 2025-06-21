/**
 * NeonFrame Shader - Placeholder for WebGL shader support (future)
 * For Canvas2D, this is a no-op.
 */
export class Shader {
    constructor(vertexSrc = '', fragmentSrc = '') {
        this.vertexSrc = vertexSrc;
        this.fragmentSrc = fragmentSrc;
        // Not implemented - placeholder for WebGL
    }
    use() {}
}