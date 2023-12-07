import { FC, useRef, useEffect } from 'react'
import style from './BoatSimulationView.module.scss'
import background_img_source from '../../assets/water2.png'

interface BoatSimulationProps {
    set_time: (new_state: (prev: number) => number) => void;
    anim_running: boolean;
    frame_len: number;
    time: number;
}

const BoatSimulation: FC<BoatSimulationProps> = ({ time, frame_len, set_time, anim_running }) => {

    const mainCanvasRef = useRef(null);
    const mainCanvasParentRef = useRef(null);

    let scale_ref = useRef(1);
    let back_img_ref = useRef(new Image());

    const load_image = (src: string, ref: React.MutableRefObject<HTMLImageElement>) =>{
        const img = new Image();
        img.src = src;
        img.onload = () => {
            ref.current = img;
        }
    }

    useEffect(()=>{
        load_image(background_img_source, back_img_ref);
    });

    const fix_dpi = (canvas: HTMLCanvasElement, parent : HTMLDivElement) => {
        const style_height = +getComputedStyle(parent).getPropertyValue("height").slice(0, -2);
        const style_width = +getComputedStyle(parent).getPropertyValue("width").slice(0, -2);
        canvas.width = style_width * devicePixelRatio;
        canvas.height = style_height * devicePixelRatio;
    };

    const draw_background = (ctx : CanvasRenderingContext2D, frame_dt: number) => {
        const size = back_img_ref.current.naturalHeight;
        if (!size)
            return; 
        const w : number = ctx.canvas.width;
        const h : number = ctx.canvas.height;

        ctx.translate(w / 2, h / 2);
        ctx.scale(scale_ref.current, scale_ref.current);

        const pos_x = (time+frame_dt) * 10; // test
        const pos_y = (time+frame_dt) * 5; //

        const x = (pos_x) % size - size;
        const y = (pos_y) % size - size;

        const by = (Math.floor(0.5*h/(size*scale_ref.current))+1)*size;
        const bx = (Math.floor(0.5*w/(size*scale_ref.current))+1)*size;

        for(let iy = -by; iy < by + size; iy+=size){
            for(let ix = -bx; ix < bx + size; ix+=size){
                ctx.drawImage(back_img_ref.current, ix+x, iy+y);
            }
        }
        ctx.resetTransform();
    };

    
    const draw_boat = (ctx : CanvasRenderingContext2D, frame_dt: number) => {
        const w : number = ctx.canvas.width;
        const h : number = ctx.canvas.height;
        const ct = (time+frame_dt)*frame_len;

        // set these values for testing
        const m_to_ctx_h = 0.03 * h;
        const L = 10 * m_to_ctx_h;
        const Hs = 5 * m_to_ctx_h;
        const W = 3 * m_to_ctx_h;
        const H = 0.1*L;

        // const yaw = -360*(ct % 5000) / 5000;
        const yaw = 0;
        const roll = -30*Math.sin(ct / 500);
        const rel_sail_yaw = 45;
        const rel_rudder_yaw = 0;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const tr3d = DOMMatrix.fromMatrix(ctx.getTransform());
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
        tr3d.scale3dSelf(scale_ref.current);

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
        
        ctx.fillStyle = "#D8D8D8";
        const h0T0 = trPoint(0,-0.5*L,0);
        ctx.beginPath();
        ctx.moveTo(h0T.x,h0T.y);
        if(roll < 0){
            ctx.bezierCurveTo(hRTb.x,hRTb.y,hR0.x,hR0.y,hR0.x,hR0.y);
            ctx.bezierCurveTo(hR0.x,hR0.y,hRBb.x,hRBb.y,hRB.x,hRB.y);
            const hRB0 = trPoint(0.3*W,0.5*L,0);
            const hRBb0 = trPoint(0.5*W,0.5*L,0);
            const hR00 = trPoint(0.5*W,0,0);
            const hRTb0 = trPoint(0.1*W,-0.5*L,0);
            ctx.lineTo(hRB0.x,hRB0.y);
            ctx.bezierCurveTo(hRBb0.x,hRBb0.y,hR00.x,hR00.y,hR00.x,hR00.y);
            ctx.bezierCurveTo(hR00.x,hR00.y,hRTb0.x,hRTb0.y,h0T0.x,h0T0.y); 
        }
        else{
            ctx.bezierCurveTo(hLTb.x,hLTb.y,hL0.x,hL0.y,hL0.x,hL0.y);
            ctx.bezierCurveTo(hL0.x,hL0.y,hLBb.x,hLBb.y,hLB.x,hLB.y);
            const hL00 = trPoint(-0.5*W,0,0);
            const hLBb0 = trPoint(-0.5*W,0.5*L,0);
            const hLB0 = trPoint(-0.3*W,0.5*L,0);
            const hLTb0 = trPoint(-0.1*W,-0.5*L,0);
            ctx.lineTo(hLB0.x,hLB0.y);
            ctx.bezierCurveTo(hLBb0.x,hLBb0.y,hL00.x,hL00.y,hL00.x,hL00.y);
            ctx.bezierCurveTo(hL00.x,hL00.y,hLTb0.x,hLTb0.y,h0T0.x,h0T0.y);
        }
        ctx.lineTo(h0T.x,h0T.y);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = "#AE6C3F";
        ctx.strokeStyle = "#666666";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(hL0.x,hL0.y);
        ctx.bezierCurveTo(hL0.x,hL0.y,hLBb.x,hLBb.y,hLB.x,hLB.y);
        ctx.lineTo(hRB.x,hRB.y);
        ctx.bezierCurveTo(hRBb.x,hRBb.y,hR0.x,hR0.y,hR0.x,hR0.y);
        ctx.bezierCurveTo(hR0.x,hR0.y,hRTb.x,hRTb.y,h0T.x,h0T.y);
        ctx.bezierCurveTo(hLTb.x,hLTb.y,hL0.x,hL0.y,hL0.x,hL0.y);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        //rudder steer
        tr3d.translateSelf(0,0.35*L);
        tr3d.rotateSelf(0,0,rel_rudder_yaw);
        
        ctx.strokeStyle = "#452100";
        const r00 = trPoint(0,0,H);
        const r0B = trPoint(0,0.1*L,H);
        ctx.beginPath();
        ctx.moveTo(r00.x,r00.y);
        ctx.lineTo(r0B.x,r0B.y);
        ctx.stroke();

        tr3d.rotateSelf(0,0,-rel_rudder_yaw);
        tr3d.translateSelf(0,-0.35*L);
        


        //sail
        tr3d.translateSelf(0,-0.22*L,0);
        tr3d.rotateSelf(0,0,rel_sail_yaw);
        
        ctx.fillStyle = "#ffffff";
        const s00M = trPoint(0,0,H+0.1*Hs);
        const s00T = trPoint(0,0,H+1.1*Hs);
        const s00B = trPoint(0,0,H);
        const s0BM = trPoint(0,0.66*Hs,H+0.1*Hs);

        ctx.beginPath();
        ctx.moveTo(s00M.x,s00M.y);
        ctx.lineTo(s00T.x,s00T.y);
        ctx.lineTo(s0BM.x,s0BM.y);
        ctx.lineTo(s00M.x,s00M.y);
        ctx.fill();

        ctx.strokeStyle = "#5F2E00";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s0BM.x,s0BM.y);
        ctx.lineTo(s00M.x,s00M.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s00B.x,s00B.y);
        ctx.lineTo(s00T.x,s00T.y);
        ctx.stroke();

    };
    
    const draw_frame = (ctx : CanvasRenderingContext2D, frame_dt: number) => { // frame_dt will be used for interpolation
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        draw_background(ctx, frame_dt);
        draw_boat(ctx, frame_dt);
    };
    
    useEffect(() => {
        let animationFrameId: number
        const canvas: HTMLCanvasElement = mainCanvasRef!.current!;
        const ctx: CanvasRenderingContext2D = canvas!.getContext('2d')!;
        let last_frame_stamp: number = 0;

        canvas.onwheel = (event: WheelEvent) => {
            scale_ref.current += -event.deltaY * 0.001
            scale_ref.current = Math.max(0.125, Math.min(scale_ref.current, 4))
        }
        
        const render = (currentTime: number) => {
            if(!last_frame_stamp || !anim_running)
                last_frame_stamp = currentTime;
            let time_diff = currentTime - last_frame_stamp;
            if(time_diff > frame_len){
                set_time(prev => prev + 1);
                last_frame_stamp = currentTime;
                time_diff = frame_len;
            }
            fix_dpi(canvas, mainCanvasParentRef.current!);
            draw_frame(ctx, time_diff / frame_len);
            animationFrameId = window.requestAnimationFrame(render);
        };
        animationFrameId = window.requestAnimationFrame(render);

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        };

    },[time,anim_running]);


    return (
        <div className={style.mainTile}>
            <div className={style.leftTile}>
                <canvas className={`${style.leftCanvas} ${style.leftCanvasTop}`}></canvas>
                <canvas className={`${style.leftCanvas} ${style.leftCanvasBottom}`}></canvas>
            </div>
            <div ref={mainCanvasParentRef} className={style.boatTile}>
                <canvas ref={mainCanvasRef} className={style.boatCanvas}></canvas>
            </div>
        </div>
    );
};

export default BoatSimulation;