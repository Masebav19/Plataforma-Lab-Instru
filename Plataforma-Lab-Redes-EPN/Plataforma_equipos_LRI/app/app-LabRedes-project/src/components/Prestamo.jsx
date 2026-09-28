import { useEffect, useRef, useState } from "react"
import requestServer from "../utils/RequestManger.js";
import "./prestamo.css"

function Prestamo({SetAction,VITE_SERVER_URL,PORT}){  
    const [option,Setoption] = useState(undefined) 
    
    
    function PrestamoComponent({}){
        const [ListDevices, SetListDevices] = useState([])
        const data = useRef([])
        const Marcas = useRef(undefined)
        const Modelos = useRef(undefined)
        const Especificaciones = useRef(undefined)
        useEffect(()=>{
            async function FecthData (){
                const NewData = await requestServer({PORT,VITE_SERVER_URL,rute:"prestamo"})
                Marcas.current = [...new Set([...NewData].map(element =>{return element.Marca}))]
                Modelos.current = [...new Set([...NewData].map(element =>{return element.Modelo}))]
                Especificaciones.current = [...new Set([...NewData].map(element =>{return element.DirIp}))]
                data.current = NewData
                SetListDevices(NewData)
            }
            if(option === "prestamo") FecthData()
        },[option])
        async function HandleSelectDevice(e){
            const element = e.target.parentElement
            if(element.classList.contains("selected")) element.classList.remove("selected")
            else element.classList.add("selected")
        }
        return(
            <>
                <h2>Lista de equipos</h2>
                <small>Seleccione los equipos que desea solicitar</small>
                <br />
                {ListDevices.length > 0 && 
                <div className="ListDeviceContainer"><div className="MarcaFilter">
                    <fieldset>
                        <legend>Filtrar por marca</legend>
                        {Marcas.current.map(marca =>{
                            return(
                                <div className="optionMarca" key={marca}>
                                    {marca}
                                </div>
                            )
                        })}
                    </fieldset>
                </div>
                <div className="ModeloFilter">
                    <fieldset>
                        <legend>Filtrar por modelo</legend>
                        {Modelos.current.map(modelo =>{
                            return(
                                <div className="optionModelo" key={modelo}>
                                        {modelo}
                                </div>  
                            )
                        })}
                    </fieldset>
                </div>
                <div className="ListDevices">
                    <div className="tableDevice">
                            <div className="tableHeader">
                                <span>Especificaciones</span>
                                <span>Modelo</span>
                                <span>Tipo</span>
                                <span>Cantidad</span>
                            </div>
                            {
                                Especificaciones.current.map((especificacion,index) =>{
                                    return(
                                        <div className="TableRow" key={index}>
                                            <span onClick={HandleSelectDevice} >{especificacion}</span>
                                            <span onClick={HandleSelectDevice} >{ListDevices.find(device=>{return device.DirIp === especificacion}).Modelo}</span>
                                            <span onClick={HandleSelectDevice} >{ListDevices.find(device=>{return device.DirIp === especificacion}).Tipo}</span>
                                            <span>
                                                <input id= {`Input-${index}`} 
                                                list={`Cantidad-${index}`}
                                                />
                                                <datalist id={`Cantidad-${index}`}>
                                                    {Array.from({length:ListDevices.filter(device=>{return device.DirIp === especificacion}).length}).map((v,i)=>{
                                                        return(
                                                            <option value={i+1}>{i+1}</option>
                                                        )
                                                    })}
                                                </datalist>
                                            </span>
                                        </div>
                                    )
                                })
                            }
                    </div>
                </div>
                </div>}
            </>
        )
    }
    return(
        <>
            <span className="optionPrestamo">
                <div className={`${option === "prestamo" ? 'selected':''}`} onClick={()=>{Setoption("prestamo")}}>Préstamo</div>            
                <div className={`${option === "devolucion" ? 'selected':''}`} onClick={()=>{Setoption("devolucion")}}>Devolución</div>            
            </span>
            {option === "prestamo" &&
                <PrestamoComponent/>
            } 
        </>
    )
}

export default Prestamo