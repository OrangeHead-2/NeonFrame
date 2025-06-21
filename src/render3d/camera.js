/**
 * NeonFrame 3D Camera
 * Perspective camera with lookAt and projection matrix.
 */
import { Matrix4 } from "../physics3d/math/matrix4.js";
import { Vector3 } from "../math/vector3.js";

export class Camera3D {
  constructor({
    fov = 60,
    aspect = 1,
    near = 0.1,
    far = 1000,
    position = new Vector3(0, 0, 5),
    target = new Vector3(0, 0, 0),
    up = new Vector3(0, 1, 0)
  } = {}) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.position = position.clone();
    this.target = target.clone();
    this.up = up.clone();
    this.projectionMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();
    this.updateProjection();
    this.updateView();
  }

  updateProjection() {
    const m = this.projectionMatrix.m;
    const f = 1.0 / Math.tan((this.fov * Math.PI) / 360);
    const nf = 1 / (this.near - this.far);
    m[0] = f / this.aspect;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = f;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = (this.far + this.near) * nf;
    m[11] = -1;
    m[12] = 0;
    m[13] = 0;
    m[14] = (2 * this.far * this.near) * nf;
    m[15] = 0;
    return this;
  }

  updateView() {
    // Right-handed LookAt
    const z = this.position.clone().subtract(this.target).normalize();
    const x = this.up.clone().cross(z).normalize();
    const y = z.clone().cross(x).normalize();
    const m = this.viewMatrix.m;
    m[0] = x.x;
    m[1] = y.x;
    m[2] = z.x;
    m[3] = 0;
    m[4] = x.y;
    m[5] = y.y;
    m[6] = z.y;
    m[7] = 0;
    m[8] = x.z;
    m[9] = y.z;
    m[10] = z.z;
    m[11] = 0;
    m[12] = -x.dot(this.position);
    m[13] = -y.dot(this.position);
    m[14] = -z.dot(this.position);
    m[15] = 1;
    return this;
  }

  lookAt(target) {
    this.target.copy(target);
    this.updateView();
  }

  setAspect(aspect) {
    this.aspect = aspect;
    this.updateProjection();
  }
}