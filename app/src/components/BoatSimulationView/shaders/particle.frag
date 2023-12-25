precision mediump float;

uniform float u_lifeTime;
varying float aliveTime;
varying vec2 pos;

const vec4 color1 = vec4(0.7804, 0.9765, 1.0, 1.0);

void main() {
    float r = length(pos);
    float circle1 = 1.0 - smoothstep(0.0, 0.01, r-10.0);
    float circle2 = 1.0 - smoothstep(0.0, 0.01, r-8.0);
    float bubble = circle1 - circle2;

    gl_FragColor = vec4(color1.rgb, color1.a * bubble * (1.0 - aliveTime / u_lifeTime));
}