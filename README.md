# NeonFrame 3D Engine

**NeonFrame 3D** is a modern, modular, and extensible JavaScript/WebGL2 game engine for real-time physically based rendering, dynamic lighting, and shadow mapping in the browser. It includes a robust renderer, camera, mesh system, advanced light and shadow support, and a user-friendly API.

---

## Features

- **WebGL2-based Renderer:** Robust, efficient, and extensible for advanced effects.
- **Multiple Lights:** Support for directional, point, and spot lights.
- **Real-Time Shadows:** Soft shadow mapping (PCF), per-light shadow control.
- **Physically Based Lighting:** Simple PBR-style main shader.
- **Mesh/Geometry Support:** Easily create and render primitives or custom meshes.
- **Camera System:** Perspective camera with lookAt and transform controls.
- **Extensible Material System:** Custom shaders and flexible uniforms.
- **Easy API:** Simple, modern import and usage patterns.
- **Production Ready:** All modules are robust and compatible.

---

## Quick Start

### 1. Install

Clone or copy the engine files into your project.

### 2. Import from the Barrel

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

### 3. Usage Example

See [USAGE.md](USAGE.md) for a complete, step-by-step guide.

#### Minimal Example

```js
const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl2');

// Load shader sources (see src/render3d/shaders/)
import shadowVert from './src/render3d/shaders/shadow.vert';
import shadowFrag from './src/render3d/shaders/shadow.frag';
import pbrVert from './src/render3d/shaders/pbr-shadow.vert';
import pbrFrag from './src/render3d/shaders/pbr-shadow.frag';

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

// Assign a shadow matrix to the light (see USAGE.md)
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

## Documentation

- [USAGE.md](USAGE.md) – Full, detailed usage guide with step-by-step instructions.
- [API Reference (inline JSDoc)](src/render3d/) – See code comments for every class and function.

---

## Extending NeonFrame

- Add more lights, meshes, or advanced materials.
- Use your own geometry or import glTF/OBJ models.
- Implement animation, post-processing, or a scene graph as needed.

---

## License

MIT (or your preferred open source license)

---

**Happy rendering!**

```