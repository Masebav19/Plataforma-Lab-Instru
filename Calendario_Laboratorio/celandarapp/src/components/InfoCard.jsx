import './InfoCard.css'
import { DAYSNAMES, MONTHNAMES } from '../utils/constants.js'


export default function InfoCard({User,session, Color,SetLog,SetSessionSelected,VITE_SERVER_URL,PORT}){
    async function handleCreateTicket(e){
        e.preventDefault()
        const BODY = {
            Correo: session.Correo_responsable,
            Asunto: session.Asunto,
            Fecha: `${session.Year}-${session.Month}-${session.Date}`
        }
        const result = await fetch(`${VITE_SERVER_URL}:${PORT}/calendar/OpenTicket`,{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(BODY)
        })
        if(result?.error) return alert(`No se puedo ingresar el ticket: ${result.error}`)
        alert('Ticket ingresado')
    }
    async function handleDeleteSession(e) {
        e.preventDefault()
        const BODY = {
           Id: session.Id
        }
        const result = await fetch(`${VITE_SERVER_URL}:${PORT}/calendar/DeleteSession`,{
            method:"DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(BODY)
        })
        const data = await result.json()
        console.log(data)
        if(data?.error) return alert(`No se puedo ingresar el ticket: ${data.error}`)
        alert('Session eliminada')
        SetSessionSelected(undefined)
        SetLog(prev=> {
            return {
                ...prev,
                Status: undefined
            }
        })
        
    }
    return(
        <div className="card-container" style={{background: Color,color:"white"}}>
            <div className="title-section">
                <span><strong>{session.Asunto}</strong></span>
                <span><img src="../public/teacher.svg" alt="Responsable" /> <small><a href={`mailto://${session.Correo_responsable}`}>{session.Responsable}</a></small></span>
            </div>
            <article>
                <span>
                    <img src="../public/time.svg" alt="Hora" />
                    <small>{session.Hora_inicial}-{session.Hora_final} {session.Periodicidad === "Semanalmente"? `Cada ${DAYSNAMES[(new Date(session.Year,session.Month,session.Date)).getDay()]}`
                    :session.Periodicidad === "Mensualmente"?`${session.Date} de ${MONTHNAMES[session.Month]}`:""}</small>
                </span>
                <span>
                    <img src="../public/month_white.svg" alt="Fecha" />
                    <small> {`${session.Date}/${(Number(session.Month)+1).toString()}/${session.Year}`} </small>
                </span>
            </article>
            {User?.UserDetail&&
            <div className="buttonCardContainer">
                {User?.UserDetail?.correo === session.Correo_responsable &&
                <button onClick={handleCreateTicket}>
                    Ticket
                </button>
                }
                {(User?.UserDetail?.correo === session.Correo_responsable) | (User?.UserDetail?.correo==='silvana.gamboa@epn.edu.ec') &&
                <button onClick={handleDeleteSession}>
                    Eliminar
                </button>
                }
            </div>}
        </div>
    )
}