attribute vec2 a_position;
attribute float a_spawnTime;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scale;
uniform float u_rot;
uniform float u_off;
uniform float u_w;

varying float aliveTime;
varying vec2 pos;

mat3 rot(float a){
    float sina = sin(a);
    float cosa = cos(a);
    return mat3(
        cosa, -sina, 0,
        sina, cosa, 0,
        0, 0, 1
    );
}

void main() {
    vec2 base = u_scale * 0.3 * a_position / u_resolution;
    float angle = mix(1.047, 2.094, fract(sin(a_spawnTime * 2137.4218)));
    float dw = mix(-u_w, u_w, fract(sin(a_spawnTime * 54357384.4321)));
    
    vec2 off =  u_scale * vec2(dw,-u_off*1.8) / u_resolution;

    vec2 dir = (rot(angle) * vec3(0.0001*u_scale,0.0,1.0)).xy;
    vec2 draw_pos = base + off + (u_time - a_spawnTime) * dir;
    vec2 p = (rot(u_rot) * vec3(draw_pos, 1.0)).xy;
    gl_Position = vec4(p, 0.0, 1.0);
    aliveTime = u_time - a_spawnTime;
    pos = a_position;
}