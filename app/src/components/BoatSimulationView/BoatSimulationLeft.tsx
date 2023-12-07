import { BoatData } from '../../types/commonTypes';

interface boatParams {
    L: number;
    W: number;
    Lk: number;
    Lx: number;
    Ly: number;
    H: number;
    Hs: number;
    Dh: number;
    Dk: number;
    Dr: number;
    R: number;
}

const waterColor = "#0052B5";
const sideColor = "#D8D8D8";
const sailColor = "#ffffff";
const hullBorderColor = "#666666";
const mastColor = "#5F2E00";
const keelRudderColor = "#5F5F5F";

const draw_side_view: (ctx: CanvasRenderingContext2D, bp: boatParams) => void = (ctx, bp) => {
    const w : number = ctx.canvas.width;
    const h : number = ctx.canvas.height;

    
    ctx.translate(w * 0.5, h * 0.75);

    // background
    ctx.fillStyle = waterColor;
    ctx.fillRect(-0.5*w,0,w,0.25 * h);
    
    // hull
    ctx.fillStyle = sideColor;
    ctx.beginPath();
    ctx.moveTo(-0.5*bp.L,-bp.H);
    ctx.lineTo(0.5*bp.L,-bp.H);
    ctx.lineTo(0.5*bp.L, bp.Dh);
    ctx.lineTo(-(0.5*bp.L-bp.Lx), bp.Dh);
    ctx.bezierCurveTo(-(0.5*bp.L-bp.Lx), bp.Dh, -0.5*bp.L, bp.Dh*0.5,-0.5*bp.L,-bp.H);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = hullBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-0.5*bp.L,-bp.H);
    ctx.lineTo(0.5*bp.L,-bp.H);
    ctx.stroke();

    ctx.fillStyle = keelRudderColor;
    ctx.translate(0,bp.Dh);
    ctx.beginPath();
    ctx.moveTo(0.5*bp.L,0);
    ctx.lineTo(0.5*bp.L,bp.Dr);
    ctx.lineTo(0.5*(bp.L-bp.Dr),bp.Dr);
    ctx.lineTo(0.5*(bp.L-bp.Dr),0);
    ctx.lineTo(0.5*bp.L,0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(bp.Lk,0);
    ctx.lineTo(bp.Lk + bp.Ly, bp.Dk);
    ctx.lineTo(bp.Ly, bp.Dk);
    ctx.lineTo(0,0);
    ctx.closePath();
    ctx.fill();

    // sail
    ctx.translate(-0.22*bp.L,-bp.H-bp.Dh);
    ctx.strokeStyle = mastColor;
    ctx.fillStyle = sailColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0,-0.1*bp.Hs);
    ctx.lineTo(0,-1.1*bp.Hs);
    ctx.lineTo(0.66*bp.Hs,-0.1*bp.Hs);
    ctx.lineTo(0,-0.1*bp.Hs);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,-1.1*bp.Hs);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,-0.1*bp.Hs);
    ctx.lineTo(0.66*bp.Hs,-0.1*bp.Hs);
    ctx.stroke();

    ctx.resetTransform();
}

const draw_front_view: (ctx: CanvasRenderingContext2D, bp: boatParams) => void = (ctx, bp) => {
    const w : number = ctx.canvas.width;
    const h : number = ctx.canvas.height;

    const Ww = bp.W *0.033;
    const Rr = bp.R + 0.5*Ww;
    
    ctx.translate(w * 0.5, h * 0.75);

    // background
    ctx.fillStyle = waterColor;
    ctx.fillRect(-0.5*w,0,w,0.25 * h);

    // hull
    ctx.fillStyle = sideColor;
    ctx.beginPath();
    ctx.moveTo(-0.5*bp.W,-bp.H);
    ctx.lineTo(0.5*bp.W,-bp.H);
    ctx.bezierCurveTo(0.5*bp.W, 0, 0.2*bp.W, bp.Dh, 0.5*Ww, bp.Dh);
    ctx.lineTo(-0.5*Ww, bp.Dh);
    ctx.bezierCurveTo(-0.2*bp.W, bp.Dh, -0.5*bp.W, 0, -0.5*bp.W,-bp.H);
    ctx.closePath();
    ctx.fill();

    // sail
    ctx.strokeStyle = mastColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0,-bp.H);
    ctx.lineTo(0, -1.1*bp.Hs);
    ctx.stroke();


    // hull front
    ctx.strokeStyle = hullBorderColor;
    ctx.beginPath();
    ctx.moveTo(-0.5*bp.W,-bp.H);
    ctx.lineTo(0.5*bp.W,-bp.H);
    ctx.stroke();

    // keel
    ctx.fillStyle = keelRudderColor;
    ctx.fillRect(-0.5*Ww, bp.Dh, Ww, bp.Dk);

    ctx.beginPath();
    ctx.arc(0, bp.Dk + bp.Dh + Rr, Rr, 0, 2*Math.PI);
    ctx.fill();

    ctx.resetTransform();
}


const boatSimulationLeft: (ctxSide: CanvasRenderingContext2D, ctxFront: CanvasRenderingContext2D, boatData: BoatData) => void = (ctxSide, ctxFront, boatData) => {
    const w : number = ctxSide.canvas.width;
    const h : number = ctxSide.canvas.height;
    const m_to_ctx = Math.min(0.07 * w, 0.045*h);
    const pW = 1000;
    const pB = 50;
    
    const L = boatData.length * m_to_ctx;
    const W = boatData.wtlr * L;
    const H = boatData.hhtlr * L;
    const As = boatData.satlsr * L * L;
    const Hs = 3 * Math.sqrt(As / 6);
    const Ak = boatData.katsar * As;
    const Lk = Math.sqrt(Ak);
    const Dk = Lk;
    const Ar = boatData.ratsar * As;
    const Dr = 2 * Math.sqrt(Ar / 2);
    const Dh = (H*pB*(1 + boatData.bmtuhm)) / (pW - pB*boatData.bmtuhm);
    const R = Math.sqrt(boatData.bmtuhm * (L*W*(H+Dh)*pB) / (Math.PI*11000*Lk));
    
    
    const Lx = 1.5*(H+Dh);
    const Ly = Lk * 0.5;
    
    const bp: boatParams = {L,W,Lk,Lx,Ly,H,Hs,Dh,Dk,Dr, R};
    ctxSide.clearRect(0,0,ctxSide.canvas.width,ctxSide.canvas.height);
    ctxFront.clearRect(0,0,ctxFront.canvas.width,ctxFront.canvas.height);
    draw_side_view(ctxSide, bp);
    draw_front_view(ctxFront, bp);
}

export default boatSimulationLeft