import { BoatData, SimulationData } from '../../types/commonTypes'
import {interpolate, BoatWebGLPrograms, bezierCurve} from './BoatSimulationHelper';

interface boatSimulationMainParams {
    gl: WebGLRenderingContext;
    webGLPrograms: BoatWebGLPrograms;
    time: number;
    frame_dt: number;
    frame_len: number;
    scale: number;
    boatData: BoatData;
    simulationData: SimulationData | null;
    u_time: number;
    particleDataRef: React.MutableRefObject<number[]>;
}

const hullTopColor = [0.682, 0.424, 0.247, 1.0];
const hullBorderColor = [0.4, 0.4, 0.4, 1.0];
const sailColor = [1.0, 1.0, 1.0, 1.0];
const mastColor = [0.373, 0.18, 0.0, 1.0];
const sideColor = [0.847, 0.847, 0.847, 1.0];
const rudderColor = [0.271, 0.129, 0.0, 1.0];

const draw_background: (params: boatSimulationMainParams) => void = ({gl, webGLPrograms, time, frame_dt, scale, simulationData, u_time}) =>{
    const w : number = gl.canvas.width;
    const h : number = gl.canvas.height;
    const m_to_ctx_h = 0.03 * h;

    const pos_x = interpolate(time, frame_dt, simulationData?.positionX) * m_to_ctx_h;
    const pos_y = interpolate(time, frame_dt, simulationData?.positionY) * m_to_ctx_h;

    gl.useProgram(webGLPrograms.background!);
    gl.viewport(0,0,w,h);
    const positionLocation = gl.getAttribLocation(webGLPrograms.background!, "a_position");
    const resolutionLocation = gl.getUniformLocation(webGLPrograms.background!, "u_resolution");
    const timeLocation = gl.getUniformLocation(webGLPrograms.background!, "u_time");
    const scaleLocation = gl.getUniformLocation(webGLPrograms.background!, "u_invScale");
    const boatPosLocation = gl.getUniformLocation(webGLPrograms.background!, "u_boatPos");
    const windRotLocation = gl.getUniformLocation(webGLPrograms.background!, "u_windRot");
    

    gl.uniform1f(scaleLocation, 1/scale);
    gl.uniform1f(windRotLocation, 1.5708);

    gl.uniform2f(resolutionLocation, w, h);
    gl.uniform2f(boatPosLocation, pos_x, pos_y);
    gl.uniform1f(timeLocation, u_time);
    gl.enableVertexAttribArray(positionLocation);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    let data = [0,0,w,0,w,h,0,h];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, data.length / 2);
}

const particle_life = 500.0;
const draw_particles: (params: boatSimulationMainParams) => void = ({gl, webGLPrograms, u_time, particleDataRef, boatData, simulationData, scale, time}) => {
    const w : number = gl.canvas.width;
    const h : number = gl.canvas.height;
    const m_to_ctx_h = 0.03 * h;

    const b = boatData.length * 0.5 * m_to_ctx_h;
    const bw = boatData.wtlr * b;

    
    let spawn_times = particleDataRef.current!;
    if(Math.floor(u_time * 10) % 5 == 0)
        spawn_times.push(u_time);

    while(u_time - spawn_times[0] > particle_life)
        spawn_times.shift();

    if(spawn_times.length <= 0)
        return;

    let positions: number[] = [];
    let time_data: number[] = [];
    for(let i = 0; i < spawn_times.length; i++){
        positions.push(-10.0,-10.0, 10.0,-10.0, 10.0,10.0);
        positions.push(-10.0,-10.0, -10.0,10.0, 10.0,10.0);
        const t = spawn_times[i];
        time_data.push(t, t, t, t, t, t);
    }

    gl.useProgram(webGLPrograms.particle!);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0,0,w,h);
    const resolutionLocation = gl.getUniformLocation(webGLPrograms.particle!, "u_resolution");
    const timeLocation = gl.getUniformLocation(webGLPrograms.particle!, "u_time");
    const lifeTimeLocation = gl.getUniformLocation(webGLPrograms.particle!, "u_lifeTime");
    const scaleLocation = gl.getUniformLocation(webGLPrograms.particle!, "u_scale");
    const rotLocation = gl.getUniformLocation(webGLPrograms.particle!, "u_rot");
    const offLocation = gl.getUniformLocation(webGLPrograms.particle!, "u_off");
    const bwLocation = gl.getUniformLocation(webGLPrograms.particle!, "u_w");
    gl.uniform2f(resolutionLocation, w, h);
    gl.uniform1f(timeLocation, u_time);
    gl.uniform1f(lifeTimeLocation, particle_life);
    gl.uniform1f(scaleLocation, scale);
    gl.uniform1f(rotLocation, simulationData?.yaw[time] || 0);
    gl.uniform1f(offLocation, b);
    gl.uniform1f(bwLocation, bw);
    
    const pos_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer);
    const positionLocation = gl.getAttribLocation(webGLPrograms.particle!, "a_position");
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
    
    const time_buffer = gl.createBuffer();
    const spawnTimeLocation = gl.getAttribLocation(webGLPrograms.particle!, "a_spawnTime");
    gl.bindBuffer(gl.ARRAY_BUFFER, time_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(time_data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(spawnTimeLocation, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(spawnTimeLocation);

    gl.drawArrays(gl.TRIANGLES, 0, time_data.length);
}

const draw_boat: (params: boatSimulationMainParams) => void = ({gl, webGLPrograms, time, frame_dt, scale, boatData, simulationData}) => {
    const w : number = gl.canvas.width;
    const h : number = gl.canvas.height;

    gl.useProgram(webGLPrograms.default!);
    gl.viewport(0,0,w,h);

    var positionLocation = gl.getAttribLocation(webGLPrograms.default!, "a_position");
    var resolutionLocation = gl.getUniformLocation(webGLPrograms.default!, "u_resolution");
    var colorLocation = gl.getUniformLocation(webGLPrograms.default!, "u_color");

    gl.uniform2f(resolutionLocation, w, h);
    gl.enableVertexAttribArray(positionLocation);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    let data = [];

    // boat params
    const m_to_ctx_h = 0.03 * h;
    const L = boatData.length * m_to_ctx_h;
    const W = boatData.wtlr * L;
    const H = boatData.hhtlr * L;
    const As = boatData.satlsr * L * L;
    const Hs = 3 * Math.sqrt(As / 6);

    const roll = interpolate(time, frame_dt, simulationData?.roll) * 180 / Math.PI;
    const yaw = interpolate(time, frame_dt, simulationData?.yaw) * 180 / Math.PI;
    const rel_sail_yaw = interpolate(time, frame_dt, simulationData?.sailPosition) * 180 / Math.PI;
    const rel_rudder_yaw = interpolate(time, frame_dt, simulationData?.rudderPosition) * 180 / Math.PI;

    const tr3d = new DOMMatrix();
    const trPoint = (x : number, y : number, z : number) => {
        return tr3d.transformPoint(new DOMPoint(x,y,z));
    }
    // point naming convention:
    // small char for boat part: h-hull s-sail r-rudder steer
    // x-axis reference: L-left 0-middle R-right
    // y-axis reference: T-top 0-middle B-bottom
    // special eg. b-beizer curve control point, 0-z of the point is 0
    // eg. hRBb0 means bottom-right beizer curve control point at z=0 used in drawing hull

    tr3d.translateSelf(0.5 * w, 0.5*h, 0);
    tr3d.scale3dSelf(scale);

    tr3d.rotateSelf(0,roll,yaw);
    
    //hull
    const hL0 = trPoint(-0.5*W,0,H);
    const hLBb = trPoint(-0.5*W,0.5*L,H);
    const hLB = trPoint(-0.3*W,0.5*L,H);
    const hRB = trPoint(0.3*W,0.5*L,H);
    const hRBb = trPoint(0.5*W,0.5*L,H);
    const hR0 = trPoint(0.5*W,0,H);
    const hRTb = trPoint(0.1*W,-0.5*L,H);
    const h0T = trPoint(0,-0.5*L,H);
    const hLTb = trPoint(-0.1*W,-0.5*L,H);

    gl.uniform4fv(colorLocation, sideColor);
    const h0T0 = trPoint(0,-0.5*L,0);
    data = [h0T.x,h0T.y];
    if(roll < 0){
        bezierCurve(hRTb.x,hRTb.y,hR0.x,hR0.y,hR0.x,hR0.y,data);
        bezierCurve(hR0.x,hR0.y,hRBb.x,hRBb.y,hRB.x,hRB.y,data);
        const hRB0 = trPoint(0.3*W,0.5*L,0);
        const hRBb0 = trPoint(0.5*W,0.5*L,0);
        const hR00 = trPoint(0.5*W,0,0);
        const hRTb0 = trPoint(0.1*W,-0.5*L,0);
        data.push(hRB0.x,hRB0.y);
        bezierCurve(hRBb0.x,hRBb0.y,hR00.x,hR00.y,hR00.x,hR00.y,data);
        bezierCurve(hR00.x,hR00.y,hRTb0.x,hRTb0.y,h0T0.x,h0T0.y,data); 
    }
    else{
        bezierCurve(hLTb.x,hLTb.y,hL0.x,hL0.y,hL0.x,hL0.y,data);
        bezierCurve(hL0.x,hL0.y,hLBb.x,hLBb.y,hLB.x,hLB.y,data);
        const hL00 = trPoint(-0.5*W,0,0);
        const hLBb0 = trPoint(-0.5*W,0.5*L,0);
        const hLB0 = trPoint(-0.3*W,0.5*L,0);
        const hLTb0 = trPoint(-0.1*W,-0.5*L,0);
        data.push(hLB0.x,hLB0.y);
        bezierCurve(hLBb0.x,hLBb0.y,hL00.x,hL00.y,hL00.x,hL00.y,data);
        bezierCurve(hL00.x,hL00.y,hLTb0.x,hLTb0.y,h0T0.x,h0T0.y,data);
    }
    data.push(h0T.x,h0T.y);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, data.length / 2);
    
    gl.uniform4fv(colorLocation, hullTopColor);
    data = [hL0.x,hL0.y];

    bezierCurve(hL0.x,hL0.y,hLBb.x,hLBb.y,hLB.x,hLB.y, data);
    data.push(hRB.x,hRB.y)
    bezierCurve(hRBb.x,hRBb.y,hR0.x,hR0.y,hR0.x,hR0.y,data);
    bezierCurve(hR0.x,hR0.y,hRTb.x,hRTb.y,h0T.x,h0T.y,data);
    bezierCurve(hLTb.x,hLTb.y,hL0.x,hL0.y,hL0.x,hL0.y,data);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, data.length / 2);

    gl.uniform4fv(colorLocation, hullBorderColor);
    gl.drawArrays(gl.LINE_STRIP, 0, data.length / 2);

    //rudder steer
    tr3d.translateSelf(0,0.35*L);
    tr3d.rotateSelf(0,0,rel_rudder_yaw);
    
    gl.uniform4fv(colorLocation, rudderColor);
    const r00 = trPoint(0,0,H);
    const r0B = trPoint(0,0.1*L,H);
    data = [r00.x,r00.y];
    data.push(r0B.x,r0B.y);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, data.length / 2);

    tr3d.rotateSelf(0,0,-rel_rudder_yaw);
    tr3d.translateSelf(0,-0.35*L);
    


    //sail
    tr3d.translateSelf(0,-0.22*L,0);
    tr3d.rotateSelf(0,0,rel_sail_yaw);
    
    gl.uniform4fv(colorLocation, sailColor);
    const s00M = trPoint(0,0,H+0.1*Hs);
    const s00T = trPoint(0,0,H+1.1*Hs);
    const s00B = trPoint(0,0,H);
    const s0BM = trPoint(0,0.66*Hs,H+0.1*Hs);

    data = [s00M.x,s00M.y];
    data.push(s00T.x,s00T.y);
    data.push(s0BM.x,s0BM.y);
    data.push(s00M.x,s00M.y);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, data.length / 2);

    gl.uniform4fv(colorLocation, mastColor);
    data = [s0BM.x,s0BM.y];
    data.push(s00M.x,s00M.y);
    data.push(s00B.x,s00B.y);
    data.push(s00T.x,s00T.y);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, data.length / 2);
}


const boatSimulationMain: (params: boatSimulationMainParams) => void = (params) => {
    params.gl.clear(params.gl.COLOR_BUFFER_BIT);
    draw_background(params);
    draw_particles(params)
    draw_boat(params);
};
export default boatSimulationMain;