import { useRef, useState } from "react"
import "./NewSession.css"
import CloseIcon from '@mui/icons-material/Close';
import LogComponent from "./LogComponent";
import NewSessionBody from "./NewSessionBody";

export default function NewSession({SetCreateNewSession,CreateNewSession,VITE_SERVER_URL, PORT,User,SetUser,LABORATORIO}){
    const [Step,SetStep] = useState(()=>{
        if (User?.result) return 1
        return 0
    })
   

    return(
        <div className="NewSessionContainer">
            <div>
                <h3 style={{color:"white"}}>{`${User?"Cree la sesión":"Inicie sesión"}`}</h3>
                <CloseIcon onClick={()=>{SetCreateNewSession({state: false, SessionInfo: undefined})}} />
            </div>
            <div className="stepPosContainer">
               {
                Array.from({length:2},(v,k)=>{return k}).map((v,i)=>{
                    return(
                        <div className={`StepNumber ${Step === i ? "Active":""}`} key={i}>
                            {i}
                        </div>
                    )
                })
               } 
            </div>
            <div className="NewSessionBody">
                {Step=== 0 && <LogComponent
                User={User}
                SetUser={SetUser}
                VITE_SERVER_URL={VITE_SERVER_URL}
                PORT={PORT}
                SetStep={SetStep}
                />}
                {Step===1 &&
                <NewSessionBody
                User={User}
                SessionInfo={CreateNewSession?.SessionInfo}
                SetCreateNewSession={SetCreateNewSession}
                VITE_SERVER_URL={VITE_SERVER_URL}
                PORT={PORT}
                LABORATORIO={LABORATORIO}
                />
                }
            </div>
           
        </div>
    )
}