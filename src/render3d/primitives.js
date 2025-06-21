/**
 * NeonFrame 3D Primitives
 * Helper functions to create common meshes: cube, sphere, plane.
 */

// Cube centered at origin, size 1
export function cubeMeshData() {
  // 8 vertices, 12 triangles, 6 faces, normals, uvs
  const positions = [
    // Front
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
    // Back
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
    -0.5,  0.5, -0.5,
  ];
  const normals = [
    // Front
    0,0,1, 0,0,1, 0,0,1, 0,0,1,
    // Back
    0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1
  ];
  const uvs = [
    0,0, 1,0, 1,1, 0,1,
    0,0, 1,0, 1,1, 0,1
  ];
  const indices = [
    // Front
    0,1,2, 0,2,3,
    // Right
    1,5,6, 1,6,2,
    // Back
    5,4,7, 5,7,6,
    // Left
    4,0,3, 4,3,7,
    // Top
    3,2,6, 3,6,7,
    // Bottom
    4,5,1, 4,1,0
  ];
  return { positions, normals, uvs, indices };
}