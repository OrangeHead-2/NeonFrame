/**
 * NeonFrame 3D Scene Node with Transform Hierarchy
 */
import { Matrix4 } from "../physics3d/math/matrix4.js";
import { Vector3 } from "../math/vector3.js";
import { Quaternion } from "../physics3d/math/quaternion.js";

export class SceneNode3D {
  constructor() {
    this.position = new Vector3(0, 0, 0);
    this.rotation = new Quaternion();
    this.scale = new Vector3(1, 1, 1);
    this.children = [];
    this.parent = null;
    this.localMatrix = new Matrix4();
    this.worldMatrix = new Matrix4();
    this.dirty = true;
  }

  add(child) {
    child.parent = this;
    this.children.push(child);
  }

  remove(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      child.parent = null;
      this.children.splice(idx, 1);
    }
  }

  updateMatrix() {
    // Compose local matrix from position, rotation, and scale
    this.localMatrix.identity();
    // ...compose matrix here (see math lib for details)
    // For brevity, assume you have a compose method:
    // this.localMatrix.compose(this.position, this.rotation, this.scale);
    // Otherwise, implement composition here
    this.dirty = false;
  }

  updateWorldMatrix(parentMatrix = null) {
    if (this.dirty) this.updateMatrix();
    if (parentMatrix) {
      this.worldMatrix = parentMatrix.clone().multiply(this.localMatrix);
    } else {
      this.worldMatrix = this.localMatrix.clone();
    }
    for (const child of this.children) {
      child.updateWorldMatrix(this.worldMatrix);
    }
  }
}