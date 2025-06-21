/**
 * NeonFrame 3D Light System (EXTENDED)
 * - Supports multiple lights (directional, point, spot)
 * - Light color, intensity, attenuation, and shadow support.
 */
export class Light3D {
  static TYPE_DIRECTIONAL = 0;
  static TYPE_POINT = 1;
  static TYPE_SPOT = 2;
  constructor({
    type = Light3D.TYPE_DIRECTIONAL,
    color = [1, 1, 1],
    intensity = 1,
    position = [0, 10, 0],
    direction = [0, -1, 0],
    range = 20,
    angle = Math.PI / 4,
    castShadow = false,
    shadowBias = 0.005,
    shadowMapSize = 1024
  } = {}) {
    this.type = type;
    this.color = color;
    this.intensity = intensity;
    this.position = position;
    this.direction = direction;
    this.range = range;
    this.angle = angle;
    this.castShadow = castShadow;
    this.shadowBias = shadowBias;
    this.shadowMapSize = shadowMapSize;
    this.shadowMap = null;
    this.shadowMatrix = null;
  }
}