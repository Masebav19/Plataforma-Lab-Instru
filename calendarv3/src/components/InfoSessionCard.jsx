import { useEffect, useRef } from "react"
import { DAYSNAMES } from "../util/constant.js"
import "./InfoSessionCard.css"

export default function InfoSessionCard({session,sessionCard,color}){
    const Panel = useRef(undefined)
    useEffect(()=>{
        const Pos = sessionCard.getBoundingClientRect()
        Panel.current.style.top = `${0}px`
        Panel.current.style.left = `${Pos.width+20}px`
    },[])
    return(
        <div className="InfoPanelContainer" ref={Panel}
        style={{position:"absolute",background:`${color}`}}>
            <span>{session.Asunto}</span><br />
            <span>{session.Responsable}</span><br />
            <span>{`${session.Hora_inicial} - ${session.Hora_final}`}</span><br />
            <span><strong>Mesas: </strong>{session.Mesas}</span><br />
            <span>{session.Periodicidad === "Semanalmente"?`Cada ${DAYSNAMES[(new Date(session.Year,session.Month,session.Date).getDay())]}`:""}</span>
        </div>
    )
}