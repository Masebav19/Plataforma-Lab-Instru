import { useState } from "react"
import fs from 'fs'


function Detalle ({User,SetLog}){
    const [deviceInfo,SetDevice] = useState([])
    function HandleSubmit(e){
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form)
        const Formdata = Object.fromEntries(formData.entries())
        requestInfo(Formdata.input).then((devices)=>{
            SetDevice(devices)
        })
    }

    async function requestInfo(type){
        const result = await fetch(`http://172.31.33.34:5000/api/detalle/${type}-${User}`)
        const res = await result.json()
        return res
    }
    function ShowDevices({deviceInfo}){
        return(
            <>
                {
                    deviceInfo.map((device)=>{
                        return(
                            <ul className="Detail Firts">
                                <li
                                key={`${device.Prestamos_Id}_${device.Modelo}}`}>Modelo : {device.Modelo}</li>
                                <ul className="Detail Second">
                                    <li className="Li-Description" 
                                    key={`${device.Prestamos_Id}_${device.Nombre}}`}>Nombre: {device.Nombre}</li>
                                    <li className="Li-Description"
                                    key={`${device.Prestamos_Id}_${device.email}}`}>email: {device.email}</li>
                                    <li className="Li-Description"
                                    key={`${device.Prestamos_Id}_${device.Direccion_IP}}`}>Direccion IP/Espacificaciones: {device.Direccion_IP}</li>
                                    <li className="Li-Description"
                                    key={`${device.Prestamos_Id}_${device.Estado}}`}>Estado: {device.Estado}</li>
                                    <li className="Li-Description"
                                    key={`${device.Prestamos_Id}_${device.Estado_prestamo}}`}>Estado Prestamo: {device.Estado_prestamo}</li>
                                    <li className="Li-Description"
                                    key={`${device.Prestamos_Id}_${device.Fecha}}`}>Fecha: {device.Fecha}</li>
                                    {(device.ModulosExpansion !== "Ninguno" || device.ModulosExpansion !== "") && 
                                    <li className="Li-Description"
                                    key={`${device.Prestamos_Id}_${device.ModulosExpansion}}`}>Módulos de expasión: {device.ModulosExpansion}</li>}
                                    {device?.DocenteResponsable &&
                                    <li className="Li-Description"
                                    key={`${device.Prestamos_Id}_${device.DocenteResponsable}}`}>Docente Responsable: {device.DocenteResponsable}</li>}
                                </ul>
                            </ul>
                        )
                        
                    })
                }
            </>
            
        )
    }

    function HandleReturn(){
        SetLog("NoLog")
    }
    function HandleExport(){
        const book = JsonToCsv(deviceInfo)
        fs.writeFile("C:/Users/1-17-07-LRI-00/Downloads/data.csv",deviceInfo,(err)=>{
            if (err){
                alert(err)
            }else{
                alert("Archivo creado en descargas")
            }
        })
    }

    function JsonToCsv(array=[]){
        if (array.length === 0) return ""
        let headers = "Id,Nombre,email,Modelo,Direccion_IP,Estado,Estado_prestamo,Fecha\n"
        const values = array.map((element)=>{
            let newElement = Object.values(element)
            newElement.pop()
            return newElement
        })
        const ValuesRow = values.map((value)=> {return value.join(',')})
        const StringRow = ValuesRow.join('\n')
        const book = headers.concat(StringRow)
        return book
    }

    return(
        <>
            <header>
                <h1>Laboratorio de instrumentación Industrial</h1>
            </header>
            <article>
                <h2>Plataforma de prestamo de equipos</h2>
                <h3>Seleccione lo que desea consultar</h3>
            </article>

            <span>
                <fieldset>
                    <legend>Menu</legend>
                    <form action="POST" onSubmit={HandleSubmit}>
                        <div className="group">
                            <img className="icon" src="../public/menu.svg" alt="" />
                            <input list="option" name="input" className="input" autocomplete="off" required placeholder="Escoja la opción"/>
                                <datalist id="option">
                                    <option value="Prestado"></option>
                                    <option value="Devuelto"></option>
                                    <option value="Todos"></option>
                                </datalist>
                        </div>
                        
                        <div className="group-button">
                            <button>Consultar</button>
                        </div>
                    </form>
                </fieldset>
                
            </span>

            {deviceInfo.length > 0 &&
                <span>
                    <ShowDevices
                        deviceInfo ={deviceInfo}
                    />
                    <div className="group-button">
                        <button onClick={HandleReturn}> Regresar</button>
                        {/* <button onClick={HandleExport}>Exportar</button> */}
                    </div>
                </span>
                }
        </>

    )
}

export default Detalle