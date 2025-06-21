#version 300 es
precision highp float;
#define MAX_LIGHTS 4
in vec3 v_worldPos;
in vec3 v_normal;
in vec4 v_shadowCoord;
uniform struct Light {
  int type;
  vec3 color;
  float intensity;
  vec3 position;
  vec3 direction;
  float range;
  float angle;
  int castShadow;
  float shadowBias;
} u_lights[MAX_LIGHTS];
uniform sampler2D u_shadowMaps[MAX_LIGHTS];
uniform mat4 u_shadowMatrices[MAX_LIGHTS];
uniform int u_receivesShadow;
out vec4 outColor;
float shadowFactor(int idx, vec4 shadowCoord, float bias) {
  vec3 proj = shadowCoord.xyz / shadowCoord.w;
  proj = proj * 0.5 + 0.5;
  float shadow = 1.0;
  if (proj.x >= 0.0 && proj.x <= 1.0 && proj.y >= 0.0 && proj.y <= 1.0) {
    float closest = texture(u_shadowMaps[idx], proj.xy).r;
    float current = proj.z - bias;
    // PCF (simple 3x3)
    float shadowSum = 0.0;
    float texelSize = 1.0 / float(textureSize(u_shadowMaps[idx], 0).x);
    for (int x = -1; x <= 1; ++x)
      for (int y = -1; y <= 1; ++y)
        shadowSum += (current > texture(u_shadowMaps[idx], proj.xy + vec2(x, y) * texelSize).r) ? 0.5 : 1.0;
    shadow = shadowSum / 9.0;
  }
  return shadow;
}
void main() {
  vec3 norm = normalize(v_normal);
  vec3 color = vec3(0.1); // Ambient
  for (int i = 0; i < MAX_LIGHTS; ++i) {
    if (u_lights[i].intensity <= 0.0) break;
    float diff = 0.0;
    if (u_lights[i].type == 0) { // Directional
      diff = max(dot(norm, -normalize(u_lights[i].direction)), 0.0);
    } else if (u_lights[i].type == 1) { // Point
      vec3 lightVec = u_lights[i].position - v_worldPos;
      float dist = length(lightVec);
      diff = max(dot(norm, normalize(lightVec)), 0.0) * (1.0 - min(dist / u_lights[i].range, 1.0));
    }
    float shadow = 1.0;
    if (u_lights[i].castShadow == 1 && u_receivesShadow == 1)
      shadow = shadowFactor(i, u_shadowMatrices[i] * vec4(v_worldPos, 1.0), u_lights[i].shadowBias);
    color += u_lights[i].color * u_lights[i].intensity * diff * shadow;
  }
  outColor = vec4(color, 1.0);
}