/**
 * NeonFrame 3D Renderer (EXTENDED)
 * - Supports multiple lights
 * - Supports multiple shadow maps
 * - Soft shadows (PCF)
 * - Per-mesh shadow-caster toggle
 */
import { ShadowMap3D } from "./shadowmap.js";
import { WebGLShader3D } from "./webgl-shader.js";

export class Renderer3DAdvanced {
  constructor(canvas, shadowShader, mainShader, maxLights = 4) {
    const { WebGLContext3D } = require("./webgl-context.js");
    this.ctx = new WebGLContext3D(canvas);
    this.gl = this.ctx.gl;
    this.lights = [];
    this.shadowShader = shadowShader;
    this.mainShader = mainShader;
    this.maxLights = maxLights;
  }
  addLight(light) {
    this.lights.push(light);
  }
  clear(r = 0, g = 0, b = 0, a = 1) {
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  renderShadowMap(meshes, light) {
    if (!light.shadowMap) light.shadowMap = new ShadowMap3D(this.gl, light.shadowMapSize);
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, light.shadowMap.framebuffer);
    gl.viewport(0, 0, light.shadowMap.size, light.shadowMap.size);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    this.shadowShader.use();
    for (let { mesh, modelMatrix, castsShadow = true } of meshes) {
      if (!castsShadow) continue;
      gl.uniformMatrix4fv(this.shadowShader.getUniform("u_lightViewProj"), false, light.shadowMatrix.m);
      gl.uniformMatrix4fv(this.shadowShader.getUniform("u_model"), false, modelMatrix.m);
      mesh.bindAttribs(this.shadowShader);
      mesh.draw();
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.ctx.width, this.ctx.height);
  }
  renderScene(meshes, camera) {
    // 1. Render shadow maps for all shadow-casting lights
    let shadowLightCount = 0;
    for (const light of this.lights) {
      if (light.castShadow && light.shadowMatrix) {
        this.renderShadowMap(meshes, light);
        shadowLightCount++;
        if (shadowLightCount >= this.maxLights) break;
      }
    }
    // 2. Render main pass with PBR+Shadow shader, passing light/shadow arrays
    const gl = this.gl;
    this.mainShader.use();
    // Pass light structs as uniforms (arrays)
    for (let i = 0; i < this.maxLights; ++i) {
      const light = this.lights[i];
      if (!light) break;
      // Light uniforms: type, color, intensity, pos, dir, range, angle, shadow, bias
      gl.uniform1i(this.mainShader.getUniform(`u_lights[${i}].type`), light.type);
      gl.uniform3fv(this.mainShader.getUniform(`u_lights[${i}].color`), light.color);
      gl.uniform1f(this.mainShader.getUniform(`u_lights[${i}].intensity`), light.intensity);
      gl.uniform3fv(this.mainShader.getUniform(`u_lights[${i}].position`), light.position);
      gl.uniform3fv(this.mainShader.getUniform(`u_lights[${i}].direction`), light.direction);
      gl.uniform1f(this.mainShader.getUniform(`u_lights[${i}].range`), light.range);
      gl.uniform1f(this.mainShader.getUniform(`u_lights[${i}].angle`), light.angle);
      gl.uniform1i(this.mainShader.getUniform(`u_lights[${i}].castShadow`), light.castShadow ? 1 : 0);
      gl.uniform1f(this.mainShader.getUniform(`u_lights[${i}].shadowBias`), light.shadowBias);
      if (light.castShadow && light.shadowMap) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, light.shadowMap.depthTexture);
        gl.uniform1i(this.mainShader.getUniform(`u_shadowMaps[${i}]`), i);
        gl.uniformMatrix4fv(this.mainShader.getUniform(`u_shadowMatrices[${i}]`), false, light.shadowMatrix.m);
      }
    }
    for (let { mesh, modelMatrix, receivesShadow = true } of meshes) {
      gl.uniformMatrix4fv(this.mainShader.getUniform("u_projection"), false, camera.projectionMatrix.m);
      gl.uniformMatrix4fv(this.mainShader.getUniform("u_view"), false, camera.viewMatrix.m);
      gl.uniformMatrix4fv(this.mainShader.getUniform("u_model"), false, modelMatrix.m);
      gl.uniform1i(this.mainShader.getUniform("u_receivesShadow"), receivesShadow ? 1 : 0);
      mesh.bindAttribs(this.mainShader);
      mesh.draw();
    }
  }
}