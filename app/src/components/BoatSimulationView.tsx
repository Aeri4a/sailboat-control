import { FC, useRef, useEffect } from 'react'
import style from './BoatSimulationView.module.scss'

interface BoatSimulationProps {
    set_time: (new_state: (prev: number) => number) => void;
    anim_running: boolean;
    frame_len: number;
    time: number;
}

const BoatSimulation: FC<BoatSimulationProps> = ({ time, frame_len, set_time, anim_running }) => {

    const canvasRef = useRef(null);

    const fix_dpi = (canvas: HTMLCanvasElement) => {
        const style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
        const style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
        canvas.setAttribute("height",String(style_height * devicePixelRatio));
        canvas.setAttribute("width",String(style_width * devicePixelRatio));
    };

    
    const draw_boat = (ctx : CanvasRenderingContext2D, frame_dt: number) => {
        const w : number = ctx.canvas.width;
        const h : number = ctx.canvas.height;
        ctx.translate(w / 2, h / 2);

        const time_of_rot = 5000; //ms
        const ct = (time+frame_dt)*frame_len;
        const da = -2*Math.PI*(ct % time_of_rot) / time_of_rot;
        ctx.rotate(da);
        ctx.translate(0.2 * h, 0);
        
        ctx.fillStyle = "#432307";
        ctx.beginPath();
        ctx.moveTo(-0.05 * h, 0.1 * h);
        ctx.lineTo(0.05 * h, 0.1 * h);
        ctx.lineTo(0.05 * h, -0.1 * h);
        ctx.lineTo(0,-0.2 * h);
        ctx.lineTo(-0.05 * h, -0.1 * h);
        ctx.lineTo(-0.05 * h, 0.1 * h);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 0.008 * h,0,2 * Math.PI);
        ctx.fill();
    };
    
    const draw_frame = (ctx : CanvasRenderingContext2D, scale : number, frame_dt: number) => { // frame_dt will be used for interpolation
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
        ctx.scale(scale, scale)
        ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
        draw_boat(ctx, frame_dt);
    };
    
    

    useEffect(() => {
        let scale: number = 1
        let animationFrameId: number
        const canvas: HTMLCanvasElement = canvasRef!.current!;
        const ctx: CanvasRenderingContext2D = canvas!.getContext('2d')!;
        let last_frame_stamp: number = 0;

        canvas.onwheel = (event: WheelEvent) => {
            scale += -event.deltaY * 0.001
            scale = Math.max(0.125, Math.min(scale, 4))
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
            fix_dpi(canvas);
            draw_frame(ctx, scale, time_diff / frame_len);
            animationFrameId = window.requestAnimationFrame(render);
        };
        animationFrameId = window.requestAnimationFrame(render);

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        };

    },[time,anim_running]);


    return (
        <div className={style.boatTile}>
            <canvas ref={canvasRef} className={style.boatCanvas}></canvas>
        </div>
    );
};

export default BoatSimulation;