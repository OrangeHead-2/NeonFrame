# NeonFrame 3D Engine – Detailed Usage Guide

Welcome to NeonFrame 3D! This guide will walk you through the essentials of setting up and rendering a lit, shadow-casting 3D scene in the browser using the advanced features of NeonFrame, with a simple, modern API.

---

## 1. Installation & Imports

**Structure:**  
Place the engine source files in your project (e.g., under `src/render3d/`).  
If you use a bundler (Vite, Webpack, etc.), you can import everything you need from the barrel file:

```js
import {
  Renderer3DAdvanced,
  WebGLShader3D,
  Mesh3D,
  cubeMeshData,
  Camera3D,
  Light3D,
  Matrix4,
  Vector3
} from './src/render3d/index.js';
```

---

## 2. HTML Setup

Add a canvas to your HTML:

```html
<canvas id="webgl-canvas" width="960" height="540" style="background:#111"></canvas>
```

---

## 3. Creating Shaders

You need two shader programs:
- Shadow map pass (depth only)
- Main PBR pass with shadows

Use provided shaders, or customize as needed:

```js
import shadowVert from './src/render3d/shaders/shadow.vert';
import shadowFrag from './src/render3d/shaders/shadow.frag';
import pbrVert from './src/render3d/shaders/pbr-shadow.vert';
import pbrFrag from './src/render3d/shaders/pbr-shadow.frag';

const gl = document.getElementById('webgl-canvas').getContext('webgl2');
const shadowShader = new WebGLShader3D(gl, shadowVert, shadowFrag);
const mainShader = new WebGLShader3D(gl, pbrVert, pbrFrag);
```

---

## 4. Initialize the Renderer

```js
const canvas = document.getElementById('webgl-canvas');
const renderer = new Renderer3DAdvanced(canvas, shadowShader, mainShader);
```

---

## 5. Create Camera

```js
const camera = new Camera3D({ aspect: canvas.width / canvas.height });
camera.position.set(3, 3, 6);
camera.lookAt(new Vector3(0, 0, 0));
```

---

## 6. Add Lights

You can add multiple lights (directional, point, spot), each with shadow and color control.

```js
const dirLight = new Light3D({
  type: Light3D.TYPE_DIRECTIONAL,
  direction: [0.3, -1, -0.7],
  color: [1, 1, 1],
  intensity: 2,
  castShadow: true,
  shadowBias: 0.004
});
renderer.addLight(dirLight);
```
For more lights, just create and add more `Light3D` instances.

---

## 7. Create and Add Meshes

You can use built-in primitives or load your own geometry:

```js
const cubeData = cubeMeshData();
const cube = new Mesh3D(gl, cubeData);
const cubeModelMatrix = new Matrix4().identity();

const meshes = [
  {
    mesh: cube,
    modelMatrix: cubeModelMatrix,
    castsShadow: true,    // default: true
    receivesShadow: true  // default: true
  }
];
// Add more objects to the meshes array as needed
```

---

## 8. Compute Light Shadow Matrix

For shadow mapping, you must provide a light-space matrix (orthographic or perspective).  
Here's a simple static directional light shadow matrix example:

```js
import { Matrix4 } from './src/physics3d/math/matrix4.js';

function makeDirectionalLightMatrix(lightDir, sceneCenter, sceneRadius) {
  // Setup an orthographic projection and lookAt from the light's POV
  const lightView = Matrix4.lookAt(
    new Vector3().copy(sceneCenter).subtract(new Vector3(...lightDir).normalize().multiplyScalar(sceneRadius)),
    sceneCenter,
    new Vector3(0, 1, 0)
  );
  const lightProj = Matrix4.ortho(-sceneRadius, sceneRadius, -sceneRadius, sceneRadius, 0.1, 2 * sceneRadius);
  return lightProj.clone().multiply(lightView);
}
dirLight.shadowMatrix = makeDirectionalLightMatrix(dirLight.direction, new Vector3(0,0,0), 8);
```

For a static scene, you can just assign a precomputed matrix.

---

## 9. Animation/Rendering Loop

```js
function renderLoop(time) {
  // (Optional) Animate objects, rotate camera, etc.
  cubeModelMatrix.identity().rotateY(time * 0.001);

  renderer.clear(0.18, 0.19, 0.21, 1);
  renderer.renderScene(meshes, camera);

  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);
```

---

## 10. Full Minimal Example

```js
import {
  Renderer3DAdvanced, WebGLShader3D, Mesh3D, cubeMeshData,
  Camera3D, Light3D, Matrix4, Vector3
} from './src/render3d/index.js';

import shadowVert from './src/render3d/shaders/shadow.vert';
import shadowFrag from './src/render3d/shaders/shadow.frag';
import pbrVert from './src/render3d/shaders/pbr-shadow.vert';
import pbrFrag from './src/render3d/shaders/pbr-shadow.frag';

const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl2');
const shadowShader = new WebGLShader3D(gl, shadowVert, shadowFrag);
const mainShader = new WebGLShader3D(gl, pbrVert, pbrFrag);
const renderer = new Renderer3DAdvanced(canvas, shadowShader, mainShader);

const camera = new Camera3D({ aspect: canvas.width / canvas.height });
camera.position.set(3, 3, 6);
camera.lookAt(new Vector3(0, 0, 0));

const dirLight = new Light3D({
  type: Light3D.TYPE_DIRECTIONAL,
  direction: [0.3, -1, -0.7],
  color: [1, 1, 1],
  intensity: 2,
  castShadow: true,
  shadowBias: 0.004
});
renderer.addLight(dirLight);

const cubeData = cubeMeshData();
const cube = new Mesh3D(gl, cubeData);
const cubeModelMatrix = new Matrix4().identity();

dirLight.shadowMatrix = Matrix4.ortho(-8,8,-8,8,0.1,20).multiply(
  Matrix4.lookAt(new Vector3(5,10,5), new Vector3(0,0,0), new Vector3(0,1,0))
);

function loop(time) {
  cubeModelMatrix.identity().rotateY(time * 0.001);
  renderer.clear(0.18, 0.19, 0.21, 1);
  renderer.renderScene([{ mesh: cube, modelMatrix: cubeModelMatrix }], camera);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

---

## 11. Advanced: Multiple Lights, Shadows, and Materials

- Add more lights (point, spot).
- Use per-object `castsShadow` or `receivesShadow` flags.
- Extend meshes array with more objects and custom transforms.
- Use your own geometry or load glTF models.
- Customize shaders for PBR, textures, normal maps, etc.

---

## 12. Tips

- For best results, use WebGL2 and modern browsers.
- To add post-processing, render to a framebuffer and add a full-screen quad pass.
- For physics, use the NeonFrame physics module in tandem.

---

## 13. Troubleshooting

- **Black screen:** Check that shaders compiled, canvas is present, and your geometry is valid.
- **No shadows:** Ensure light.shadowMatrix is set and the mesh casts/receives shadows.
- **Performance:** Lower shadow map size, reduce light count, or optimize your meshes.

---

**You're ready to build interactive, real-time 3D web experiences with physically correct lighting and shadows!**