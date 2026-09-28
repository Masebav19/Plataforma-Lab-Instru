import { useRef, useState } from "react"
import { TextField,
    IconButton, Box, Button
 } from "@mui/material";
import CameraIcon from '@mui/icons-material/Camera';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Webcam from "react-webcam";
import "./TicketComponent.css"
export default function TicketComponent({ticket,SetTicket,VITE_SERVER_URL,PORT}){
    const [openCam, SetOpenCam] = useState(false)
    const [capture,SetCapture] = useState(undefined)
    const webCamRef = useRef(undefined)
    const Observacion = useRef(undefined)

    async function handleCaptura(e){
        e.preventDefault()
        const imageSrc = webCamRef.current.getScreenshot()
        SetCapture(imageSrc)
    }

    async function handleCloseTicket(e){
        e.preventDefault()
        let imageBlod = undefined
        if(capture){
            imageBlod = base64toBlod(capture)
        }
        const BODY = new FormData();
        BODY.append("observaciones",`${Observacion.current.value}`)
        BODY.append("equipos_usados","No aplica")
        BODY.append("id_ticket",ticket.id_ticket)
        if(capture){
            BODY.append("image",imageBlod,"image.jpg")
        }

        const URL = "CloseTicket"
        const METHOD = "POST"
        const result = await fetch(`${VITE_SERVER_URL}:${PORT}/calendar/${URL}`, {
            method: METHOD,
            body:BODY
        })
        const data = await result.json()
        if(data?.error) {
            alert(data.error)
        }
        alert("Ticket Creado")
        SetTicket(undefined)
        
        
    }

    function base64toBlod(BaseData,contentType = "image/jpeg"){
        const byteCharacters = atob(BaseData.split(",")[1])
        const byteArrays =[]

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }
    
    return(
        <div className="TicketConatiner"
        style={{display:"flex",flexDirection:"column",justifyContent:"space-between"}}
        >
            <p>El ticket ha sido registrado correctamente. Por favor, ingrese una descripción detallada de lo sucedido e incluya en el texto el código del equipo o de los equipos involucrados. De ser necesario, adjunte una fotografía que permita complementar la información proporcionada.</p>
            <TextField
            type="text"
            label="Descripción"
            multiline
            rows={4}
            sx={{minHeight:"10vh"}}
            inputRef={Observacion}
            >
            </TextField>
            <IconButton
            sx={{width:window.innerWidth>670?"10vw":"20vw",fontSize:"18px", borderRadius:"14px"}}
            onClick={()=> SetOpenCam(!openCam)}
            >
                <CameraAltIcon/>
                <p
                style={{border:"0",margin:"0",padding:"0"}}
                >Fotografía</p>
            </IconButton>
            {openCam && <Box
            component="div"
            sx={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"10px",
            }}
            >
                <Webcam
                audio={false}
                ref={webCamRef}
                screenshotFormat="image/jpeg"
                videoConstraints = {{facingMode:"enviroment"}}
                width={"100%"}
                />
                <IconButton
                sx={{width:"3vw"}}
                onClick={handleCaptura}
                >
                    <CameraIcon/>
                </IconButton>
                {capture&&
                <Box
                component="div"
                >
                    <img src={capture} alt="Captura" />
                </Box>
                }
            </Box>
            }
            <Button
            onClick={handleCloseTicket}
            >
                Enviar
            </Button>
        </div>
    )
}