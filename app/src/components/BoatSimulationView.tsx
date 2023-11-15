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

    const draw_boat = (ctx : CanvasRenderingContext2D) => {
        const w : number = ctx.canvas.width
        const h : number = ctx.canvas.height
        ctx.translate(w/2,h/2)
        
        ctx.fillStyle = "#432307"
        ctx.beginPath()
        ctx.moveTo(-0.05*h,0.1*h)
        ctx.lineTo(0.05*h,0.1*h)
        ctx.lineTo(0.05*h,-0.1*h)
        ctx.lineTo(0,-0.2*h)
        ctx.lineTo(-0.05*h,-0.1*h)
        ctx.lineTo(-0.05*h,0.1*h)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = "#000000"
        ctx.beginPath()
        ctx.moveTo(0,0)
        ctx.arc(0,0,0.008*h,0,2*Math.PI)
        ctx.fill()
    }

    const draw_frame = (ctx : CanvasRenderingContext2D, scale : number) => {
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
        ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2)
        ctx.scale(scale, scale)
        ctx.translate(-ctx.canvas.width/2, -ctx.canvas.height/2)
        draw_boat(ctx)
    }
    
    let animationFrameId: number

    useEffect(() => {
        const canvas : HTMLCanvasElement = canvasRef.current!
        const ctx : CanvasRenderingContext2D = canvas!.getContext('2d')!

        var scale : number = 1

        canvas.onwheel = (event : WheelEvent) => {
            scale += -event.deltaY * 0.001
            scale = Math.max(0.125,Math.min(scale,4))
        }

        const render = () => {
            fix_dpi(canvas)
            draw_frame(ctx, scale)
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