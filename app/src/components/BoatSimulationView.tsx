import { FC, useRef, useEffect } from 'react'
import style from './BoatSimulationView.module.scss'
import background_img_source from '../assets/water2.png'

interface BoatSimulationProps {
    set_time: (new_state: (prev: number) => number) => void;
    anim_running: boolean;
    frame_len: number;
    time: number;
}

const BoatSimulation: FC<BoatSimulationProps> = ({ time, frame_len, set_time, anim_running }) => {

    const canvasRef = useRef(null);

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

    const fix_dpi = (canvas: HTMLCanvasElement) => {
        const style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
        const style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
        canvas.setAttribute("height",String(style_height * devicePixelRatio));
        canvas.setAttribute("width",String(style_width * devicePixelRatio));
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
        ctx.translate(w / 2, h / 2);
        ctx.scale(scale_ref.current, scale_ref.current);

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
        ctx.resetTransform();
    };
    
    const draw_frame = (ctx : CanvasRenderingContext2D, frame_dt: number) => { // frame_dt will be used for interpolation
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        draw_background(ctx, frame_dt);
        draw_boat(ctx, frame_dt);
    };
    
    useEffect(() => {
        let animationFrameId: number
        const canvas: HTMLCanvasElement = canvasRef!.current!;
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
            fix_dpi(canvas);
            draw_frame(ctx, time_diff / frame_len);
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