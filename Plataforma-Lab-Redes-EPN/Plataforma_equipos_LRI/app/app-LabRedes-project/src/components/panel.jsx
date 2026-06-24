import { useEffect, useState } from 'react';
import Menu from './menu.jsx'
import Prestamo from './Prestamo.jsx'
import MainDetalle from './MainDetalle.jsx';


function Panel({VITE_SERVER_URL,PORT}){
    const [menuAction,SetAction] = useState("Menu")

    return(
        <>
           {menuAction==="Menu"&&<Menu
            SetAction= { SetAction }
           /> }
           {menuAction==="Prestamo" && <Prestamo
            SetAction= {SetAction}
            VITE_SERVER_URL={VITE_SERVER_URL}
            PORT = {PORT}
           />}
           {menuAction === "Detalle" && <MainDetalle
           />}
        </>
    );
}

export default Panel