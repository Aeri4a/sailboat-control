import { BoatData } from '../../types/commonTypes'

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
}

const draw_side_view: (ctx: CanvasRenderingContext2D, bp: boatParams) => void = (ctx, bp) => {
    const w : number = ctx.canvas.width;
    const h : number = ctx.canvas.height;

    
    ctx.translate(w * 0.5, h * 0.66);

    //background
    ctx.fillStyle = "#0052B5";
    ctx.fillRect(-0.5*w,0,w,0.34 * h);
    
    //hull
    ctx.fillStyle = "#D8D8D8";
    ctx.beginPath();
    ctx.moveTo(-0.5*bp.L,-bp.H);
    ctx.lineTo(0.5*bp.L,-bp.H);
    ctx.lineTo(0.5*bp.L, bp.Dh);
    ctx.lineTo(-(0.5*bp.L-bp.Lx), bp.Dh);
    ctx.bezierCurveTo(-(0.5*bp.L-bp.Lx), bp.Dh, -0.5*bp.L, bp.Dh*0.5,-0.5*bp.L,-bp.H);
    ctx.closePath();
    ctx.fill();

    // sail
    ctx.translate(-0.22*bp.L,-bp.H);
    ctx.strokeStyle = "#5F2E00";
    ctx.fillStyle = "#ffffff";
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

const boatSimulationLeft: (ctxSide: CanvasRenderingContext2D, ctxFront: CanvasRenderingContext2D, boatData: BoatData) => void = (ctxSide, ctxFront, boatData) => {
    const w : number = ctxSide.canvas.width;
    const m_to_ctx_w = 0.07 * w;
    const pW = 1000;
    const pB = 50;
    
    const L = boatData.length * m_to_ctx_w;
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
    
    
    const Lx = 1.5*(H+Dh);
    const Ly = Lk * 0.5;
    
    const bp: boatParams = {L,W,Lk,Lx,Ly,H,Hs,Dh,Dk,Dr};
    ctxSide.clearRect(0,0,ctxSide.canvas.width,ctxSide.canvas.height);
    ctxFront.clearRect(0,0,ctxFront.canvas.width,ctxFront.canvas.height);
    draw_side_view(ctxSide, bp);
}

export default boatSimulationLeft