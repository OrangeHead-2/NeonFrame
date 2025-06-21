/**
 * NeonFrame 3D Default Shaders (GLSL)
 */
export const VERTEX_SHADER_BASIC = `#version 300 es
precision highp float;
in vec3 a_position;
in vec3 a_normal;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;
out vec3 v_normal;
void main() {
  v_normal = mat3(u_model) * a_normal;
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
}
`;

export const FRAGMENT_SHADER_BASIC = `#version 300 es
precision highp float;
in vec3 v_normal;
out vec4 outColor;
void main() {
  float lighting = dot(normalize(v_normal), vec3(0, 0, 1)) * 0.5 + 0.5;
  outColor = vec4(vec3(lighting), 1.0);
}
`;