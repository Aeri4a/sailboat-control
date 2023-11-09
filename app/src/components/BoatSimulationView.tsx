import { FC, useRef, useEffect } from 'react'
import style from './BoatSimulationView.module.scss'




const BoatSimulation: FC = () => {

    const canvasRef = useRef(null)

    const fix_dpi = (canvas : HTMLCanvasElement) => {
        const style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0,-2)
        const style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0,-2)
        canvas.setAttribute("height",String(style_height*devicePixelRatio))
        canvas.setAttribute("width",String(style_width*devicePixelRatio))
    }

    const draw_frame = (ctx : CanvasRenderingContext2D) => {
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
        ctx.fillStyle = "#ff0000"
        ctx.fillRect(10,10,100,100)
    }
    
    let animationFrameId: number

    useEffect(() => {
        const canvas : HTMLCanvasElement = canvasRef.current!

        const ctx : CanvasRenderingContext2D = canvas!.getContext('2d')!
        const render = () => {
            fix_dpi(canvas)
            draw_frame(ctx)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }

    },[draw_frame])



    return (
        <div className={style.boatTile}>
            <canvas ref={canvasRef} className={style.boatCanvas}></canvas>
            <input type='range' className={style.boatInput} min='0' max="100" step="1"></input>
        </div>
    )
}

export default BoatSimulation