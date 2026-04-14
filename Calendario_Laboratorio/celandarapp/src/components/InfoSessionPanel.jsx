import InfoCard from "./InfoCard"
import './InfoSessionPanel.css'
const COLOR = ["#262532","#353446","#3a3a52","#444361","#535277","#262532","#353446","#3a3a52","#444361","#535277"]
export default function InfoSessionPanel ({User,SessionSelected,SetLog,SetSessionSelected,VITE_SERVER_URL,PORT}){
    return(
        <div className="InfoPanel">
            {SessionSelected&&
            SessionSelected.map((session, index) =>{
                return(
                    <InfoCard
                        User = {User}
                        session={session}
                        Color = {COLOR[index]}
                        SetLog={SetLog}
                        SetSessionSelected={SetSessionSelected}
                        VITE_SERVER_URL={VITE_SERVER_URL}
                        PORT={PORT}
                        key={index}
                    />
                )
            })}
        </div>
    )
}