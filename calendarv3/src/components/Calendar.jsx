import { useEffect, useRef, useState } from "react"
import { DAYS , MONTHS} from "../util/constant.js"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddIcon from '@mui/icons-material/Add';
import "./Calendar.css"
import RequestsManager from "../util/RequetsManager.js"
import DayInfo from "./DayInfo.jsx";
import LogComponent from "./LogComponent.jsx";
import CloseIcon from '@mui/icons-material/Close';
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

export default function Calendar({VITE_SERVER_URL, PORT,LABORATORIOS}){
    const [CalendarDays,SetCalendarDays] = useState([])
    const [CreateNewSession, SetCreateNewSession] = useState({state: false, SessionInfo: undefined})
    const now = useRef(undefined)
    const [User,SetUser]=useState(undefined)
    const [LoginDialog, SetLogInDialog] = useState(false)
    const [openDeleteDialog, SetOpenDeleteDialog] = useState(false)
    const [laboratorio,SetLaboratorio] = useState(LABORATORIOS[0].value)

    async function handleLogout() {
        const URL = "Logout"
        const response = await fetch(`${VITE_SERVER_URL}:${PORT}/calendar/${URL}`, {
            method: 'POST',  
        })
        const result = await response.json()
        if (result?.result){
            window.localStorage.removeItem('expiresAt')
            SetUser(undefined)
        }
    }
    const setAutologOut = async (expirationTime) => {
        setTimeout(() => {
            handleLogout();
        }, expirationTime);
    };
    useEffect(()=>{
        const expiresAt = window.localStorage.getItem('expiresAt')
        if(expiresAt){
            setAutologOut(parseInt(expiresAt,10))
        }
    },[User])
    useEffect(()=>{
        window.localStorage.getItem('CalendarDate')? now.current=new Date(window.localStorage.getItem('CalendarDate')):now.current = new Date()
        const month = now.current.getMonth()+1
        const year = now.current.getFullYear()
        const URL = `getDaysbyWeek/${month}/${year}/${now.current.getDate()}/${laboratorio}`
        RequestsManager({VITE_SERVER_URL,PORT,URL}).then(result =>{
            SetCalendarDays(result)
        })
    },[])
    useEffect(()=>{
        window.localStorage.getItem('CalendarDate')? now.current=new Date(window.localStorage.getItem('CalendarDate')):now.current = new Date()
        const month = now.current.getMonth()+1
        const year = now.current.getFullYear()
        const URL = `getDaysbyWeek/${month}/${year}/${now.current.getDate()}/${laboratorio}`
        RequestsManager({VITE_SERVER_URL,PORT,URL}).then(result =>{
            SetCalendarDays(result)
        })
        window.scrollTo({top:0,behavior:"smooth"})
    },[CreateNewSession,openDeleteDialog,laboratorio])
    async function handleReturnDate(e){
        e.preventDefault()
        now.current.setDate(now.current.getDate()-7)
        window.localStorage.setItem("CalendarDate",now.current)
        const month = now.current.getMonth()+1
        const year = now.current.getFullYear()
        const URL = `getDaysbyWeek/${month}/${year}/${now.current.getDate()}/${laboratorio}`
        RequestsManager({VITE_SERVER_URL,PORT,URL}).then(result =>{
            SetCalendarDays(result)
        })
    }
    async function handleNextDate(e){
        e.preventDefault()
        now.current.setDate(now.current.getDate()+7)
        window.localStorage.setItem("CalendarDate",now.current)
        const month = now.current.getMonth()+1
        const year = now.current.getFullYear()
        const URL = `getDaysbyWeek/${month}/${year}/${now.current.getDate()}/${laboratorio}`
        RequestsManager({VITE_SERVER_URL,PORT,URL}).then(result =>{
            SetCalendarDays(result)
        })
    }

    async function handleLabChange(e,newLaboratorio){
        e.preventDefault()
        SetLaboratorio(newLaboratorio)
    }
    return(
        <>
            <div id="CalendarMain">
                <div id="CalendarHeader">
                    <div className="CalendarButtons">
                        <span onClick={()=>{
                            now.current = new Date()
                            window.localStorage.removeItem("CalendarDate")
                            const month = now.current.getMonth()+1
                            const year = now.current.getFullYear()
                            const URL = `getDaysbyWeek/${month}/${year}/${now.current.getDate()}/${laboratorio}`
                            RequestsManager({VITE_SERVER_URL,PORT,URL}).then(result =>{
                                SetCalendarDays(result)
                            }) 
                        }}>Today</span>
                        <ChevronLeftIcon 
                        sx={{width:window.innerWidth <= 670?"15px":"auto", height:window.innerWidth <= 670?"15px":"3vh"}}
                        onClick={handleReturnDate}/>
                        <ChevronRightIcon 
                        sx={{width:window.innerWidth <= 670?"15px":"auto", height:window.innerWidth <= 670?"15px":"3vh"}}
                        onClick={handleNextDate}/>
                        {CalendarDays.length > 0 && <h4>{window.innerWidth > 670?`${CalendarDays[0].Date} de ${MONTHS[CalendarDays[0].Month]} ${CalendarDays[CalendarDays.length-1].Year} - ${CalendarDays[CalendarDays.length-1].Date} de ${MONTHS[CalendarDays[CalendarDays.length-1].Month]} ${CalendarDays[CalendarDays.length-1].Year}`:
                            `${CalendarDays[0].Date.toString().padStart(2,"0")}/${(CalendarDays[0].Month+1).toString().padStart(2,"0")} - ${CalendarDays[CalendarDays.length-1].Date.toString().padStart(2,"0")}/${(CalendarDays[CalendarDays.length-1].Month+1).toString().padStart(2,"0")}`}</h4>}
                        {User?.User &&
                            <div className="UserName">
                                {`${User.User.Nombre.at(0)}${User.User.Apellido.at(0)}`}
                            </div>
                        }
                    </div>
                    <div className="CalendarMisc">
                        <div>
                            <ToggleButtonGroup
                            color="primary"
                            value={laboratorio}
                            exclusive
                            onChange={handleLabChange}
                            aria-label="Platform"
                            >
                                {LABORATORIOS.map(lab =>{
                                    return(
                                      <ToggleButton 
                                        sx={{height:"20px",width:"100%", fontSize: window.innerWidth <= 670?'10px':"auto"}}
                                        value={lab.value}>{window.innerWidth <= 670?lab.text.at(0):lab.text}</ToggleButton>  
                                    )
                                })}
                            </ToggleButtonGroup>
                        </div>
                        {laboratorio!=="general"&&<div className="NewSession"
                        onClick={()=>{SetCreateNewSession(prev => ({...prev, state:true}))}}>
                            <AddIcon
                            sx={{width:window.innerWidth<970?'10px':"auto"}}
                            />
                            {window.innerWidth>970 && <span>{"Nueva Sesión"}</span>}
                        </div>}
                        {laboratorio!=="general"&&<span className="DayType"
                        onClick={()=>{
                            if(!User)return SetLogInDialog(true)
                            SetUser(undefined)
                        }}
                        style={{cursor:"pointer"}}>
                        {User?.User?"LogOut":"LogIn"}
                        </span>}
                    </div>                
                </div>
                {CalendarDays.length > 0 && <div className="CalendarBody">
                    <div className="BodyHeader">
                        <div className="DayHour"></div>
                        {DAYS.map((month,index) =>{
                            return(
                                <div className="DayName" key={index}>
                                    <span>{month}</span>
                                    <div className={CalendarDays[index].isToday ?"isToday":""}>{CalendarDays[index].Date}</div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="BobyContent">
                       <DayInfo
                        CalendarDays={CalendarDays}
                        CreateNewSession={CreateNewSession}
                        SetCreateNewSession={SetCreateNewSession}
                        VITE_SERVER_URL={VITE_SERVER_URL}
                        PORT={PORT}
                        LABORATORIO={laboratorio}
                        User={User}
                        SetUser={SetUser}
                        SetOpenDeleteDialog={SetOpenDeleteDialog}
                        openDeleteDialog={openDeleteDialog}
                       />
                    </div>
                </div>}
                {LoginDialog &&
                 <div
                 className="LoginDialogContainer"
                 style={{position:"fixed",top:"0",
                    transform:window.innerWidth>670?"translate(38vw,20%)":"translate(12%,20%)",background:"var(--bg)",
                    border: "solid 2px var(--border)",
                    borderRadius: "20px", 
                    padding:"10px" 
                }}
                 
                 >
                    <div style={{display:"flex", flexDirection:"row",justifyContent:"space-between",alignItems:"center",
                        paddingLeft:"10px",paddingRight:"10px"
                    }}>
                        <h3 style={{color:"black"}}>{`${User?"Cree la sesión":"Inicie sesión"}`}</h3>
                        <CloseIcon onClick={()=>{SetLogInDialog(false)}} 
                            style={{cursor:"pointer"}}/>
                    </div>
                    <LogComponent
                    PORT={PORT}
                    SetUser={SetUser}
                    User={User}
                    VITE_SERVER_URL={VITE_SERVER_URL}
                    SetLogInDialog={SetLogInDialog}
                    />
                 </div>

                }
            </div>
            
        </>
    )
}