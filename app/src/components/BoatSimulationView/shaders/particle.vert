attribute vec2 a_position;
attribute float a_spawnTime;
uniform vec2 u_resolution;
uniform float u_time;

varying float aliveTime;
varying vec2 pos;

void main() {
    vec2 base = 0.3 * 2.0 * a_position / u_resolution;
    vec2 draw_pos = base + (u_time - a_spawnTime) * vec2(.0, -0.001);
    float t = a_spawnTime;
    gl_Position = vec4(draw_pos, 0.0, 1.0);
    aliveTime = u_time - a_spawnTime;
    pos = a_position;
}