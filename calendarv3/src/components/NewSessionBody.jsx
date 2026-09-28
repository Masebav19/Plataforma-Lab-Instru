import { Box, TextField, InputLabel, FormControl, Select, MenuItem,
    IconButton
 } from "@mui/material";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from "react";
import RequestsManager from "../util/RequetsManager.js";
import { div } from "motion/react-client";

const VITE_DEVICE_SERVER_PORT = 5000
const columns =[
    {field: 'Id', headerName: 'ID', width: 70},
    {field: 'DirIp', headerName: 'Especificaciones', width: 280},
    {field: 'codigo', headerName: 'codigo', width: 130},
    {field: 'Modelo', headerName: 'Modelo', width: 130},
    {field: 'Marca', headerName: 'Marca', width: 130},
]
const paginationModel = { page: 0, pageSize: 5 };

export default function NewSessionBody({User,SessionInfo,VITE_SERVER_URL,PORT,SetCreateNewSession,LABORATORIO}){
    const [devices, SetDevices] = useState()
    const SelectedDevices = useRef([])
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
                    element.id = element.Id
                    return element
                })
                SetDevices(auxdevices)
        })
    },[])
    
    async function handleCreateSession(e){
        e.preventDefault()
        if(Number(Hora_final.current.value) < Number(Hora_inicial.current.value)) return alert("Rango de horas erroneo")
            const URL = "NewSession"
            const METHOD = "POST"
            const BODY = {
                Asunto: Asunto.current.value,
                Hora_inicial: Hora_inicial.current.value.padStart(2,"0").concat(":00"),
                Hora_final: Hora_final.current.value.padStart(2,"0").concat(":00"),
                Periodicidad: Periodicidad.current.value,
                Responsable: Responsable.current.value,
                Correo_responsable: CorreoResp.current.value,
                fecha_inicio: fecha_inicio.current.value,
                Mesas: Mesas.current.value,
                laboratorio: LABORATORIO,
                Equipos_usados: Asunto.current.value.toLowerCase().includes("reserva") && SelectedDevices.current.length > 0 ? SelectedDevices.current.map(
                    device=>{return `${device.Id},${device.codigo}`})
                    .join(";"):"Ninguno" 
            }
            const result = await RequestsManager({VITE_SERVER_URL,PORT,URL,METHOD,BODY})
            if(result?.success) {
                alert(`Session creada`)
                SetCreateNewSession({state: false, SessionInfo: undefined})
            }else {
                alert(`${result.error}`)
                SetCreateNewSession({state: false, SessionInfo: undefined})
            }
        
    }
    return(
        <Box 
        component="div"
        sx={{padding:"10px",display:"flex",flexDirection:"column",
            gap:"10px",height:"100%",overflowY:"auto"}}
        >
            <TextField
                type="text"
                defaultValue={`${User.User.Nombre} ${User.User.Apellido}`}
                label="Responsable"
                inputRef={Responsable}
            />
            <TextField
                type="email"
                defaultValue={User.result}
                label="Email"
                inputRef={CorreoResp}
            />
            <TextField
                type="text"
                defaultValue={`Reserva_${(function(){
                    const now = new Date()
                    return `${now.getTime()}`
                })()}`}
                label="Asunto"
                inputRef={Asunto}
            />
            
            <Box
                component="div"
                sx={{padding:"5px",display:"flex",flexDirection:"row",gap:"5px"}}
            >
                <TextField
                    type="number"
                    defaultValue={SessionInfo?.initialHour||6}
                    label="Hora inicial"
                    sx={{width:"50%"}}
                    inputRef={Hora_inicial}
                />
                <TextField
                    type="number"
                    defaultValue={(SessionInfo?.initialHour+1)||7}
                    label="Hora final"
                    sx={{width:"50%"}}
                    inputRef={Hora_final}
                />
                
            </Box>

            <TextField
                type="date"
                defaultValue={`${SessionInfo?.day.Year}-${(SessionInfo?.day.Month+1).toString().padStart(2,"0")}-${SessionInfo?.day.Date.toString().padStart(2,"0")}`}
                label="Fecha"
                inputRef={fecha_inicio}
            />
            <FormControl sx={{minWidth: "100%" }}>
                <InputLabel id={`Periodicidad`}>Periodicidad</InputLabel>
                <Select
                    aria-describedby={`helper-text`}
                    label="Periodicidad"
                    inputRef={Periodicidad}
                >
                    <MenuItem value={"Ninguno"}>Ninguno</MenuItem>
                    <MenuItem value={"Semanalmente"}>Semanalmente</MenuItem>
                    <MenuItem value={"Mensualmente"}>Mensualmente</MenuItem>
                    <MenuItem value={"Anualmente"}>Anualmente</MenuItem>
                </Select>
            </FormControl>
            
            <FormControl sx={{minWidth: "100%" }}>
                <InputLabel id={`Mesa`}>Mesa</InputLabel>
                <Select
                aria-describedby={`helper-text`}
                label="Mesa"
                inputRef={Mesas}
                >
                    {LABORATORIO==="sensores"?<MenuItem value={"Mesa1"}>Mesa1</MenuItem>:<MenuItem value={"Mesa4"}>Mesa4</MenuItem>}
                    {LABORATORIO==="sensores"?<MenuItem value={"Mesa2"}>Mesa2</MenuItem>:<MenuItem value={"Mesa5"}>Mesa5</MenuItem>}
                    {LABORATORIO==="sensores"?<MenuItem value={"Mesa3"}>Mesa3</MenuItem>:<MenuItem value={"Mesa6"}>Mesa6</MenuItem>}
                    {LABORATORIO==="sensores"?<MenuItem value={"Mesa1,Mesa2"}>Mesa1,Mesa2</MenuItem>:
                    <MenuItem value={"Mesa4,Mesa5"}>Mesa4,Mesa5</MenuItem>}
                    {LABORATORIO==="sensores"?<MenuItem value={"Mesa2,Mesa3"}>Mesa2,Mesa3</MenuItem>:
                    <MenuItem value={"Mesa5,Mesa6"}>Mesa5,Mesa6</MenuItem>}
                    {LABORATORIO==="sensores"?<MenuItem value={"Mesa1,Mesa2,Mesa3"}>Mesa1,Mesa2,Mesa3</MenuItem>:
                    <MenuItem value={"Mesa4,Mesa5,Mesa6"}>Mesa4,Mesa5,Mesa6</MenuItem>}
                </Select>
            </FormControl>
            {devices&&
            <Box
            component={div}
            sx={{width:"100%"}}
            >
                <DataGrid
                    rows={devices}
                    columns={columns}
                    initialState={{pagination: {paginationModel}}}
                    pageSizeOptions={[5,10,20]}
                    checkboxSelection
                    sx={{background:"transparent"}}
                    onCellClick={(row)=>{
                        if(SelectedDevices.current.find((device)=> {return device.id === row.row.id})) return SelectedDevices.current.splice(SelectedDevices.current.findIndex(device=> device.Id === row.row.Id),1)
                        SelectedDevices.current.push(row.row)
                    }}
                    
                />
            </Box>}
            <Box
            component="div"
            sx={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}
            >
                <IconButton onClick={handleCreateSession}>
                    <EditCalendarIcon/>
                </IconButton>
            </Box>
        </Box>
    )
}