
import { useEffect, useState } from "react"
import DetalleLogin from "./DetalleLogin"
import Detalle from './detalle.jsx'

function MainDetalle ({SetLog}){
    
    const [UserDetail,SetUser]= useState("None")

    return(
        <>
            {UserDetail === "None" && <DetalleLogin
                SetUser = {SetUser}
            />}
            {UserDetail === "Admin" && <Detalle 
            User = {UserDetail}
            SetLog={SetLog}
            />}
        </>
    )
}

export default MainDetalle