import { useEffect, useRef, useState } from "react"
import { AVBHOURS } from "../util/constant.js"
import InfoSessionCard from "./InfoSessionCard.jsx"
import { Box, IconButton, Button
 } from "@mui/material";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import RequestsManager from "../util/RequetsManager.js";
import TicketComponent from "./TicketComponent.jsx";

const COLORSESSIONS =["#1E6EE3","#5055B8","#8A499B","#B33D7F","#D04273","#4F64CE","#7F5AB2","#AF4F96","#E0457B"]

export default function SessionCard({session, container,User,VITE_SERVER_URL,PORT,openDeleteDialog, SetOpenDeleteDialog}){
    const [infoPanel, SetInfoPanel] = useState(false)
    const sessionCard = useRef(undefined)
    const [ButtonOption,SetButtonOption] = useState(false)
    const [ticket, SetTicket] = useState(undefined)

    useEffect(()=>{
        const ParentElementInfo = container
        const height = ParentElementInfo.height
        const limits = [Number(AVBHOURS[0].replace(/[A-Z]M/,""))-1,Number(AVBHOURS[AVBHOURS.length-1].replace(/[A-Z]M/,""))+1]
        const InitialHour = Number(session.Hora_inicial.split(":")[0])+Number(session.Hora_inicial.split(":")[1])/60
        const FinalHour = Number(session.Hora_final.split(":")[0])+Number(session.Hora_final.split(":")[1])/60
        const m = height/(AVBHOURS.length+1)
        const CardHeight = m*(InitialHour-6)
        const CardWidth = m*(FinalHour-6)-CardHeight
        sessionCard.current.style.top = `${session.Mesas.includes("Mesa1")||session.Mesas.includes("Mesa4")?CardHeight+ParentElementInfo.top:
            session.Mesas.includes("Mesa2")||session.Mesas.includes("Mesa5")?CardHeight+ParentElementInfo.top+m/3:CardHeight+ParentElementInfo.top+2*m/3

        }px` 
        sessionCard.current.style.height = `${0.95*CardWidth*session.Mesas.split(",").length/3}px` 
        const color = COLORSESSIONS[Math.round((COLORSESSIONS.length-1)*Math.random())]
        sessionCard.current.style.background = `${color}`
        sessionCard.current.style.boxShadow = `5px 1px 2px 1px${color}` 
        sessionCard.current.style.gridTemplateRows  = `${session.Mesas.split(",").map(()=>{return "1fr"}).join(" ")}`
    },[])

    async function handleCloseDelete(){
        SetOpenDeleteDialog(false)
    }
    async function handleDeleteSession(e){
        e.preventDefault()
        const BODY= {
            Id: session.Id
        }
        const URL = "DeleteSession"
        const METHOD = "DELETE"
        const result = await RequestsManager({VITE_SERVER_URL,PORT,URL,METHOD,BODY})
        if(result?.error){
            alert(result.error)
            SetOpenDeleteDialog(false)
            return SetButtonOption(false)
        }
        alert("Session eliminada")
        SetOpenDeleteDialog(false)
        return SetButtonOption(false)


    }

    async function handleOpenTicket(e){
        e.preventDefault()
        const BODY ={
            Correo: User.User.correo,
            Asunto: session.Asunto,
            Fecha: `${session.Year}-${session.Month}-${session.Date}`
        }
        const URL = "OpenTicket"
        const METHOD = "POST"
        const result = await RequestsManager({VITE_SERVER_URL,PORT,URL,METHOD,BODY})
        if(result?.error) return alert(result.error)
        SetTicket(result.result)

    }
    
    return(
        <div className="Session" 
        style={{position:"absolute",width:"12.5dvw", fontSize:"13px",
          padding:"8px",borderRadius:"10px", boxSizing:"border-box",
          color:"var(--accent-soft)",display:"grid" 
        }} 
        ref={sessionCard}
        onMouseOver={()=>SetInfoPanel(true)}
        onMouseLeave={()=>SetInfoPanel(false)}
        
        >
            {
                Array.from({length:session.Mesas.split(",").length},(v,k)=>{return session.Mesas.split(",")[k]}).map((v,i)=>{
                    if(session.Mesas.includes(v))
                    return(
                        <div style={{gridRow:`${i}/${i+1}`,display:"flex",flexDirection:"row",gap:window.innerWidth>670?"6px":"1px",border:"none"}} key={i}
                        onClick={()=>{SetButtonOption(!ButtonOption)}}
                        >
                            <div style={{border:"none",
                                background:session.Mesas.includes(v)?"var(--accent)":"var(--text-muted)",
                                borderRadius:"50%",padding:"0.4vw",width:"10px",height:"10px",textAlign:"center",display:"flex",
                                justifyContent:"center",alignItems:"center"                               
                                }}>
                                <small
                                style={{fontSize:window.innerWidth<670?"2.5vw":"12px"}}
                                >{`${v.at(v.length-1)}`}</small> 
                            </div>
                            <small
                            style={{fontSize:window.innerWidth < 670?"10px":"12px"}}
                            >{window.innerWidth>670?
                            `${session.Responsable.split(" ")[0]} ${session.Responsable.split(" ")[1].at(0)}.   ${session.Asunto.toLowerCase().match(/gr[0-9]*s*[0-9]/)?session.Asunto.toLowerCase().match(/gr[0-9]*s*[0-9]/)[0].toUpperCase():""}`:
                            `${session.Responsable.split(" ")[0].at(0)}${session.Responsable.split(" ")[1].at(0)}`
                            }</small>
                        </div>
                    )
                    else return(<></>)
                })
            }
            {infoPanel && <InfoSessionCard
            session={session}
            sessionCard={sessionCard.current}
            color={sessionCard.current.style.background}
            />}
            {ButtonOption && User?.User.correo === session.Correo_responsable &&
                <Box
                component="div"
                sx={{position:"absolute",transform:window.innerWidth>670?"translateX(-3.5vw)":"translateX(-10vw)",
                    width:window.innerWidth>670?"3vw":"9vw",border:"solid 1px var(--text-soft)", background:"var(--grid-line)"}}
                >
                    <IconButton onClick={handleOpenTicket}>
                        <AppRegistrationIcon
                        color="info"
                        />
                    </IconButton>
                    <IconButton onClick={()=> SetOpenDeleteDialog(true)}>
                        <DeleteForeverIcon
                        color="info"/>
                    </IconButton>
                    <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDelete}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    role="alertdialog"
                    >
                        <DialogTitle
                        id="Delete-session-dialog"
                        >
                         {"¿Desea elminiar la sesión o el grupo de sesiones?"}   
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={handleCloseDelete} autoFocus>
                                Cancelar
                            </Button>
                            <Button onClick={handleDeleteSession}>De Acuerdo</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            }
            {ticket && 
                <TicketComponent
                ticket={ticket}
                SetTicket={SetTicket}
                VITE_SERVER_URL={VITE_SERVER_URL}
                PORT={PORT}
                />
            }
        </div>
    )
}