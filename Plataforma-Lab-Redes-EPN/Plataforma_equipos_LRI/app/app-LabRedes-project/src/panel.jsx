import { useEffect, useState } from 'react';
import Menu from './menu.jsx'
import Prestamo from './Prestamo.jsx'
import Devolucion from './Devolucion.jsx';
import MainDetalle from './MainDetalle.jsx';
import Mantenimiento from './Mantenimiento.jsx';

function Panel({SetLog,VITE_SERVER_URL,PORT}){
    const [menuAction,SetAction] = useState("Menu")
    const [data,setData] = useState(undefined)
    const [FilterValue,SetFilterValue]= useState(undefined)
    useEffect(()=>{
        if (menuAction == "Prestamo"){
            requestServer(menuAction.toLowerCase()).then((value)=>{
                const SetValue = new Set(value.map((newValue)=>{return newValue.Marca}))
                let data = [];
                SetValue.forEach((element)=>{
                    data.push({Marca: element})
                }) 
                SetFilterValue(data)
                setData(value)
            })
        }else if (menuAction == "Devolucion"){
            requestServer("Devolucion").then((value)=>{
                setData(value)
            })
        }
    },[menuAction])

    async function requestServer (type){
        const result = await fetch(`${VITE_SERVER_URL}:${PORT}/api/${type}`)
        const res = await result.json()
        return res
    }
    return(
        <>
           {menuAction==="Menu"&&<Menu
            SetAction= { SetAction }
           /> }
           {menuAction==="Prestamo" && data && <Prestamo
            data = {data}
            FilterValue = {FilterValue}
            SetLog = {SetLog}
            SetAction= {SetAction}
            VITE_SERVER_URL={VITE_SERVER_URL}
            PORT = {PORT}
           />}
           {menuAction==="Devolucion" && data && <Devolucion
            data = {data}
            SetLog = {SetLog}
            SetAction= {SetAction}
            VITE_SERVER_URL={VITE_SERVER_URL}
            PORT = {PORT}
           />}
           {menuAction === "Detalle" && <MainDetalle
            SetLog={SetLog}
           />}
           {menuAction === "Mantenimiento" && <Mantenimiento
            SetLog={SetLog}
            SetAction= {SetAction}
            VITE_SERVER_URL={VITE_SERVER_URL}
            PORT = {PORT}
           />}
        </>
    );
}

export default Panel