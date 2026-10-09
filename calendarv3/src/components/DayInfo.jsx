import { AVBHOURS } from "../util/constant.js"
import "./DayInfo.css"
import SessionCard from "./SessionCard.jsx"
import NewSession from "./NewSession.jsx"
import { useRef, useState } from "react"

export default function DayInfo({CalendarDays,CreateNewSession, SetCreateNewSession, VITE_SERVER_URL, PORT,User,SetUser,openDeleteDialog, SetOpenDeleteDialog, LABORATORIO}){
    const container = useRef(undefined)
    return(
        <>
            <div className="Hour">
                {Array.from({length: AVBHOURS.length +1}).map((v,i)=>{
                    return(
                        <div className="HourContainer" key={i}>
                            <small
                            >{AVBHOURS[i]}</small>
                        </div>
                    )
                })}
            </div>
            <div className="DaysInfoConatiner">
                {CalendarDays.map((day,index) =>{                    
                    return(
                            <div className="DayInfoContainer" key={index}
                            style={{display:"grid", gridTemplateRows:`repeat(${AVBHOURS.length +1},12vh)`}}
                            ref={container}>
                            {day?.sessions && container?.current && (!day?.feriados) &&
                                day.sessions.map(session =>{
                                    return(
                                        <SessionCard
                                        session={session}
                                        container={container.current.getBoundingClientRect()}
                                        User={User}
                                        key={session.Id}
                                        VITE_SERVER_URL={VITE_SERVER_URL}
                                        PORT={PORT}
                                        SetOpenDeleteDialog={SetOpenDeleteDialog}
                                        openDeleteDialog={openDeleteDialog}
                                        />
                                    )
                                })
                            }
                            {Array.from({length: AVBHOURS.length +1}).map((v,i)=>{
                                    return(
                                        <div className="sessionEmpty" key={i}
                                        onClick={()=>{if (LABORATORIO!== "general" && (!day?.feriados)){
                                                SetCreateNewSession(prev => ({
                                                ...prev, 
                                                state:true, 
                                                SessionInfo: {
                                                    day: day,
                                                    initialHour: 6+i
                                                }
                                                }))
                                            }
                                            }}>
                                        </div>
                                    )
                                })} 
                            </div>

                    )
                })}     
            </div>
            {CreateNewSession.state &&
            <NewSession
            SetCreateNewSession={SetCreateNewSession}
            CreateNewSession={CreateNewSession}
            VITE_SERVER_URL={VITE_SERVER_URL}
            PORT={PORT}
            User={User}
            SetUser={SetUser}
            LABORATORIO={LABORATORIO}
            />
            }
        </>
    )
}