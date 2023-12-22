attribute vec2 a_position;
uniform vec2 u_resolution;

varying vec2 resolution;
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

mat3 translate(vec2 off){
    return mat3(
        1, 0, 0,
        0, 1, 0,
        off.x, off.y, 1
    );
}

mat3 scale(vec2 scale){
    return mat3(
        scale.x, 0, 0,
        0, scale.y, 0,
        0, 0, 1
    );
}

void main() {
    vec2 clipSpace = 2.0 * a_position / u_resolution - 1.0;
    vec2 halfRes = 0.5 * u_resolution;
    gl_Position = vec4(clipSpace * vec2(1,-1), 0, 1);
    resolution = u_resolution;
    pos = gl_Position.xy;
}