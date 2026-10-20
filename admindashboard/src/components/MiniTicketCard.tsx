import { Box } from "@mui/material"

interface MiniTicketProp{
    ticket:{
        Asunto: string
        Correo_responsable: string
        Date: number
        Equipos_usados: string
        Hora_final: string
        Hora_inicial: string
        Id: number
        Mesas: string
        Month: number
        Periodicidad: string
        Responsable: string
        UUID_usuario: string
        Year: number
        equipos_usados: string
        fecha_cierre: string
        fecha_inicio: string
        fecha_registro: string
        id_session: number
        id_ticket: string
        image_path: string
        laboratorio: string
        observaciones: string
        
    }
}
export default function MiniTicketCard({ticket}:MiniTicketProp){
    return(
        <Box
        component="div"
        >
            <p>{ticket.Asunto}</p>
            <small>{(new Date(ticket.fecha_cierre)).toISOString()}</small>
        </Box>
    )
}

