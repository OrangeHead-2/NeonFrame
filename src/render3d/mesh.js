/**
 * NeonFrame 3D Mesh
 * Stores geometry (positions, normals, uvs, indices) and manages VAO/VBOs.
 */
export class Mesh3D {
  constructor(gl, { positions, normals, uvs, indices }) {
    this.gl = gl;
    this.vertexCount = indices ? indices.length : positions.length / 3;

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // Positions
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Normals
    if (normals) {
      this.normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    } else {
      this.normalBuffer = null;
    }

    // UVs
    if (uvs) {
      this.uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    } else {
      this.uvBuffer = null;
    }

    // Indices
    if (indices) {
      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    } else {
      this.indexBuffer = null;
    }

    gl.bindVertexArray(null);
  }

  bindAttribs(shader) {
    const gl = this.gl;
    gl.bindVertexArray(this.vao);

    // Position
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    const posLoc = shader.getAttrib("a_position");
    if (posLoc !== -1 && posLoc !== null) {
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    }

    // Normal
    if (this.normalBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      const normLoc = shader.getAttrib("a_normal");
      if (normLoc !== -1 && normLoc !== null) {
        gl.enableVertexAttribArray(normLoc);
        gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0);
      }
    }

    // UV
    if (this.uvBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      const uvLoc = shader.getAttrib("a_uv");
      if (uvLoc !== -1 && uvLoc !== null) {
        gl.enableVertexAttribArray(uvLoc);
        gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
      }
    }

    if (this.indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }
  }

  draw() {
    const gl = this.gl;
    if (this.indexBuffer) {
      gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    }
    gl.bindVertexArray(null);
  }
}