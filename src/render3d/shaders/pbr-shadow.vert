#version 300 es
precision highp float;
in vec3 a_position;
in vec3 a_normal;
uniform mat4 u_projection, u_view, u_model, u_lightViewProj;
out vec3 v_worldPos;
out vec3 v_normal;
out vec4 v_shadowCoord;
void main() {
  vec4 worldPos = u_model * vec4(a_position, 1.0);
  v_worldPos = worldPos.xyz;
  v_normal = mat3(u_model) * a_normal;
  v_shadowCoord = u_lightViewProj * worldPos;
  gl_Position = u_projection * u_view * worldPos;
}