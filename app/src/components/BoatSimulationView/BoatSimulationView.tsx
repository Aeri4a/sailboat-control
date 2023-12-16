import { FC, useRef, useEffect } from 'react'
import { BoatData, SimulationData } from '../../types/commonTypes'
import style from './BoatSimulationView.module.scss'
import background_img_source from '../../assets/background.png'
import  boatSimulationMain  from './BoatSimulationMain'
import boatSimulationLeft from './BoatSimulationLeft'

interface BoatSimulationProps {
    set_time: (new_state: (prev: number) => number) => void;
    anim_running: boolean;
    frame_len: number;
    time: number;
    boatData: BoatData;
    simulationData: SimulationData | null;
}

const BoatSimulation: FC<BoatSimulationProps> = ({ time, frame_len, set_time, anim_running, boatData, simulationData }) => {

    const mainContainerRef = useRef(null);
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const leftTopCanvasRef = useRef<HTMLCanvasElement>(null);
    const leftBottomCanvasRef = useRef<HTMLCanvasElement>(null);

    let fix_dpi_required = useRef(false);
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
        const parent_style = getComputedStyle(canvas.parentElement!);
        const style_height = +parent_style.getPropertyValue("height").slice(0, -2);
        const style_width = +parent_style.getPropertyValue("width").slice(0, -2);
        // canvas.width = style_width * devicePixelRatio;
        // canvas.height = style_height * devicePixelRatio;
        canvas.width = style_width;
        canvas.height = style_height;
    };
    
    const draw_frame = (frame_dt: number) => { // frame_dt will be used for interpolation
        const scale = scale_ref.current
        const background_image = back_img_ref.current;
        const ctx: CanvasRenderingContext2D = mainCanvasRef.current!.getContext('2d')!;
        boatSimulationMain({ctx, time, frame_dt, frame_len, scale, boatData, background_image, simulationData});
        boatSimulationLeft(leftTopCanvasRef.current!.getContext('2d')!, leftBottomCanvasRef.current!.getContext('2d')!, boatData);
    };
    
    useEffect(() => {
        let animationFrameId: number;
        const canvas: HTMLCanvasElement = mainCanvasRef!.current!;
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
            if(fix_dpi_required.current){
                fix_dpi(canvas);
                fix_dpi(leftTopCanvasRef.current!);
                fix_dpi(leftBottomCanvasRef.current!);
                fix_dpi_required.current = false;
            }

            draw_frame(time_diff / frame_len);
            animationFrameId = window.requestAnimationFrame(render);
        };
        animationFrameId = window.requestAnimationFrame(render);

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        };

    },[time,anim_running,boatData,simulationData]);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            fix_dpi_required.current = true;
        });
        observer.observe(mainContainerRef.current!);

        return () => {
            observer.disconnect();
        }
    },[]);


    return (
        <div ref={mainContainerRef} className={style.mainTile}>
            <div className={style.leftTile}>
                <div className={`${style.leftCanvasTile} ${style.leftCanvasTopTile}`}>
                    <canvas ref={leftTopCanvasRef} className={style.boatCanvas}></canvas>
                </div>
                <div className={`${style.leftCanvasTile} ${style.leftCanvasBottomTile}`}>
                    <canvas ref={leftBottomCanvasRef} className={style.boatCanvas}></canvas>
                </div>
            </div>
            <div className={style.boatTile}>
                <canvas ref={mainCanvasRef} className={style.boatCanvas}></canvas>
            </div>
        </div>
    );
};

export default BoatSimulation;