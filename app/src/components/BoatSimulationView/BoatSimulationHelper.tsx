export function interpolate(time : number, frame_dt: number, data: number[] | undefined){
    if (!data)
        return 0;
    const p1 = data![time] || 0;
    if (time+1 >= data.length)
        return p1;
    const p2 = data![time+1]!;
    return p1 + frame_dt * (p2 - p1);
}

export function createShader(gl: WebGLRenderingContext, type: WebGLRenderingContextBase | number, source: string){
    const shader = gl.createShader(+type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
  
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export function bezierCurve(x2:number,y2:number,x3:number,y3:number,x4:number,y4:number,data:number[],iter:number=20) {
    const x1 = data[data.length-2];
    const y1 = data[data.length-1];

    for(let n = 0; n <= iter; n++){
        const t = n / iter;
        const invT = 1 - t;
        const invT2 = invT*invT;
        const invT3 = invT2*invT;

        const t2 = t*t;
        const t3 = t2*t;

        const px = x1 * invT3 + 
            x2 * 3 * t * invT2 +
            x3 * 3 * invT * t2 +
            x4 * t3;

        const py = y1 * invT3 + 
            y2 * 3 * t * invT2 +
            y3 * 3 * invT * t2 +
            y4 * t3;
            
        data.push(px, py);
    }
}

export interface BoatWebGLPrograms{
    default: WebGLProgram | null;
    background: WebGLProgram | null;
}