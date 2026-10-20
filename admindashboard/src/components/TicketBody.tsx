import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import RequestsManager from "../util/RequetsManager"
import MiniTicketCard from "./MiniTicketCard"

export default function TicketBody(){
    const [tickets,setTickets]= useState(Array())
    useEffect(()=>{
        const URL = 'GetClosedTickets'
        RequestsManager({METHOD:"GET",BODY:"",URL}).then(response=>{
            if(response?.error) return alert(response.error)
            const tickets = response?.result
            setTickets(tickets)
        })
    },[])
    return(
        <Box
        component="div"
        sx={{width:"100%",height:"100%"}}
        >
            {tickets.length > 0 &&
            <Box
            component="div"
            sx={{display:"grid", gridTemplateColumns:"repeat(3,1fr)",padding:"5px",gap:"10px"}}
            >
                {tickets.map(ticket=>{
                    return(
                        <MiniTicketCard
                        ticket={ticket}
                        />
                    )
                })}
            </Box>
            }
        </Box>
    )
}