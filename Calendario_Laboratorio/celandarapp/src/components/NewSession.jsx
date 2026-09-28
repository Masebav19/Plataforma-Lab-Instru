import { useState } from "react"
import { useEffect } from "react"
import { useRef } from "react"
import "./NewSession.css"
import RequestsManager from "../utils/RequetsManager.js"

const VITE_DEVICE_SERVER_PORT = 5000
const DEVICETYPES = ["Controlador","Termómetro","Modem Hart","Tarjeta de adquisición","Planta",
  "Medicion","Fuente","Osciloscopio","Plancha","Variador","Motor","Balanza Digital","PLC",
  "Sensor","Actuador","Punta de prueba Tektronix","Computador"]

export default function NewSession({Log,SetLog,VITE_SERVER_URL,PORT}){
    const [devices, SetDevices] = useState(undefined)
    const Asunto = useRef(undefined)
    const Responsable = useRef(undefined)
    const CorreoResp = useRef(undefined)
    const Hora_inicial = useRef(undefined)
    const Hora_final = useRef(undefined)
    const fecha_inicio = useRef(undefined)
    const Periodicidad = useRef(undefined)
    const Mesas = useRef(undefined)

    useEffect(()=>{
        fetch(`${VITE_SERVER_URL}:${VITE_DEVICE_SERVER_PORT}/api/prestamo`).then(result => result.json()).then(data =>{
                const auxdevices = data.map(element => {
                    element.IsSelected = false
                    return element
                })
                SetDevices(auxdevices)
        })
    },[])
    async function handleNewSession(e){
        e.preventDefault()
        const minInicial = Hora_inicial.current.value.split(':')[1]
        const minFinal = Hora_final.current.value.split(':')[1]
        if(!(minInicial === "15"|| minInicial === "30" || minInicial === "00" || minInicial === "45" ||
          minFinal === "15"|| minFinal === "30" || minFinal === "00" || minFinal === "45")){
          
            alert(`El intervalo del la hora inicial o final es de 15 minutos`)
            return  
    
        }
          const URL = "NewSession"
          const METHOD = "POST"
          const BODY = {
            Asunto: Asunto.current.value,
            Hora_inicial: Hora_inicial.current.value,
            Hora_final: Hora_final.current.value,
            Periodicidad: Periodicidad.current.value,
            Responsable: Responsable.current.value,
            Correo_responsable: CorreoResp.current.value,
            fecha_inicio: fecha_inicio.current.value,
            Mesas: Mesas.current.value,
            Equipos_usados: Asunto.current.value ==="Reserva"?devices.filter(device =>
              device.IsSelected
            ).map(deviceSelected =>{
              {return `${deviceSelected.DirIp},${deviceSelected.Modelo},${deviceSelected.codigo}` }
            }).join(";"):"Ninguno"
          }
          const result = await RequestsManager({VITE_SERVER_URL,PORT,URL,METHOD,BODY})
          if(result?.success) {
            alert(`Session creada`)
            SetLog({state: false, Status: undefined, session:false})
          }else {
            alert(`${result.error}`)
            SetLog({state: false, Status: undefined, session:false})
          }
        
    }
    return(
        <div className="SessionConatiner">          
          <div className="SessionPanel">
            <div className="inputContainer">
              <label htmlFor="Asunto">Asunto</label>
              <input type="text" id = "Asunto" ref={Asunto} required defaultValue={"Reserva"}/>
            </div>
            <div className="inputContainer">
              <label htmlFor="Responsable">Responsable</label>
              <input type="text" id = "Responsable" ref={Responsable} required defaultValue={`${Log?.session?.User?.Nombre?Log?.session?.User?.Nombre:""} ${Log?.session?.User?.Apellido?Log?.session?.User?.Apellido:""}`}/>
            </div>
            <div className="inputContainer">
              <label htmlFor="CorreoRes">Correo del responsable</label>
              <input type="email" id = "CorreoRes" ref={CorreoResp} required defaultValue={Log?.session?.User?.correo}/>
            </div>
            <div className="inputContainer">
              <label htmlFor="Periodicidad">Periodicidad</label>
                <input list='ListPeriodicidad' id = "Periodicidad" ref={Periodicidad} required defaultValue={"Ninguno"}/>
                <datalist id='ListPeriodicidad'>
                  <option value="Semanalmente">Semanalmente</option>
                  <option value="Mensualmente">Mensualmente</option>
                  <option value="Anualmente">Anualmente</option>
                  <option value="Ninguno">Ninguno</option>
                </datalist>
            </div>
           <div className="inputContainer">
              <label htmlFor="Hora_inicial">Hora Inicial</label>
              <input type="time" id = "Hora_inicial" ref={Hora_inicial} 
              required step={"900"} min={"07:00"} max={"21:45"}
              defaultValue={Log?.session?.TimeSession?.inicio}/>
              
            </div>
           <div className="inputContainer">
              <label htmlFor="Hora_final">Hora Final</label>
              <input type="time" id = "Hora_final" ref={Hora_final} 
              required step={"900"} min={"07:00"} max={"21:45"}
              defaultValue={Log?.session?.TimeSession?.fin}/>
          </div>
           <div className="inputContainer">
              <label htmlFor="Fecha">Fecha</label>
              <input type="date" id = "Fecha" ref={fecha_inicio} required defaultValue={Log.session?.NewSessionInfo ? Log.session?.NewSessionInfo:""}/>
          </div>
           <div className="inputContainer">
              <label htmlFor="MesasInput">Numero de mesas</label>
              <input list='MesasList' id = "MesasInput" ref={Mesas} required
              defaultValue={"Mesa1"}/>
              <datalist id='MesasList'>
                <option value="Mesa1">Mesa1</option>
                <option value="Mesa2">Mesa2</option>
                <option value="Mesa3">Mesa3</option>
                <option value="Mesa1,Mesa2">Mesa1,Mesa2</option>
                <option value="Mesa2,Mesa3">Mesa2,Mesa3</option>
                <option value="Mesa1,Mesa2,Mesa3">Mesa1,Mesa2,Mesa3</option>
              </datalist>
          </div>
          <small>Equipos a usar</small>
            <div className="device-Container">
                
             {devices &&
                devices.map((device,index) =>{
                    return(
                    <div className="deviceInfoContainer" 
                    key={index} title={`Nombre: ${device.DirIp}\nCódigo: ${device.codigo}`}
                    onClick={(e)=>{
                        e.preventDefault();
                        SetDevices(prev =>{
                            return prev.map((d, i) =>
                                i === index
                                    ? { ...d, IsSelected: true }
                                    : d
                            )
                        })
                    }}
                    style={{display:`${device.IsSelected?"none":"block"}`}}
                    >
                        <span key={device.DirIp}>
                            {`${device.DirIp}`}
                        </span>
                    </div>
                        )
                    })           
             }
            </div>
            <div className="buttonPanel">
              <button onClick={handleNewSession}>Iniciar</button>
              <button onClick={()=>{
                SetLog(prev=>{
                  return{
                    ...prev,
                    session:false
                  }
                })
              }}>Cerrar</button>
            </div>
          </div>

          <div id="deviceSelectedContainer">
            {
              DEVICETYPES.map(type =>{
                return(
                  devices?.find(device => device.IsSelected && device.Tipo === type)&&
                  <div className="TypeDeviceConatiner">
                    <img src={`../public/${type}.webp`} alt="Medicion" />
                    <span><p>{`${devices.filter(device => device.IsSelected && device.Tipo === type).length}`}</p></span>
                  </div>
                )
              })
            }
          </div>
        </div>
    )
}