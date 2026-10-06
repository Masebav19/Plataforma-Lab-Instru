import { Send_email } from '../Controllers/emailClient.js'
import  { emailSchema } from './messageSchema.js'
import dotenv from 'dotenv'

dotenv.config()
export async function SenEmail(data={},asunto=""){
    let DataEmailToSend = emailSchema;
    DataEmailToSend.To = DataEmailToSend.To.concat(';',data.email)    
    if (asunto.includes("Reserva")){
        DataEmailToSend.To = DataEmailToSend.To.concat(';',process.env.SECUNDARY_EMAIL_TO) 
        DataEmailToSend.asunto = `Solicitud de reserva del Laboratorio de Redes Industriales`
        const response = await fetch(`${process.env.SERVER_DEVICE}/api/devices`)
        const allDevices = await response.json()
        const devices = data.Equipos_usados.split(";").map((infoDevice,index) =>{
            return allDevices.find(device=>{
                return Number(device.Id) === Number(infoDevice.split(',')[0])
            })
        })
        DataEmailToSend.html= 
        `<h2>Se ha realizado una reserva del laboratorio con los siguientes datos:</h2>
        <p><strong>Responsable:</strong> ${data.Responsable}</p>
        <p><strong>Fecha de la reserva:</strong> ${data.fecha_inicio}</p>
        <p><strong>Horario:</strong> ${data.Hora_inicial}- ${data.Hora_final}</p>

        <div style="display:flex;justify-content:center;align-items:center">
        <table style="border-collapse:collapse;border:2px solid rgb(140 140 140);font-family: sans-serif;font-size:0.8rem;letter-spacing:1px">
        <caption style="caption-side:bottom;padding:10px;font-weight:bold">
            Equipos a usarse en el laboratorio
        </caption>
        <tr>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Id</th>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">codigo</th>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Equipo</th>
        </tr>
        ${devices.map(device=>{return `
            <tr>
                <td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${device?.Id?device.Id:"Ninguno"}</td>
                <td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${device?.codigo?device.codigo:"Ninguno"}</td>
                <td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${device?.Especificaciones?device.Especificaciones:"Ninguno"}</td>
            </tr>
            `})}
        </table>
        </div>
        <p>Este correo declara que la persona que realiza la reserva es el responsable de cualquier daño,evento o fallo de los equipos usados. En caso de daño el responsable se hará cargo de la reparación o en el peor de los casos la adquisición del reemplazo</p><br>
            <h4>Laboratorio de instrumentación Industrial</h4>
            <p>Departamento de automatización y control</p>
            <small>Escuela Politécnica Nacional</small>`
    }else if(asunto === "Ticket") {
        DataEmailToSend.asunto = `Observaciones de Ticket`
        if(!(data.imagePath?.includes("Ninguno"))){
            const filemane = data.imagePath
            const Path = `http://127.0.0.1:4000/calendar/GetTicketImage/${data.id_ticket}`
            const cid = data.id_ticket
            DataEmailToSend.attachments = [
                {
                    filemane,path:Path,cid
                }
            ]
        }

        const response = await fetch(`${process.env.SERVER_DEVICE}/api/devices`)
        const allDevices = await response.json()
        const devices = data.Equipos_usados.split(";").map((infoDevice,index) =>{
            return allDevices.find(device=>{
                return Number(device.Id) === Number(infoDevice.split(',')[0])
            })
        })
        DataEmailToSend.html= 
        `<h2>Se ha realizado una observación del ticket</h2>
        <p><strong>Responsable:</strong> ${data.Responsable}</p>
        <p><strong>Fecha de la session:</strong> ${data.fecha_inicio}</p>
        <p><strong>Horario:</strong> ${data.Hora_inicial}- ${data.Hora_final}</p>
        <div style="display:flex;justify-content:center;align-items:center">
        <table style="border-collapse:collapse;border:2px solid rgb(140 140 140);font-family: sans-serif;font-size:0.8rem;letter-spacing:1px">
        <caption style="caption-side:bottom;padding:10px;font-weight:bold">
            Equipos usados en el laboratorio
        </caption>
         <tr>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Id</th>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">codigo</th>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Equipo</th>
        </tr>
        ${devices.map(device=>{return `
            <tr>
                <td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${device.Id}</td>
                <td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${device.codigo}</td>
                <td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${device.Especificaciones}</td>
            </tr>
        `})}
        </table>
        </div>
        <div style="display:flex;justify-content:center;align-items:center">
        <table style="border-collapse:collapse;border:2px solid rgb(140 140 140);font-family: sans-serif;font-size:0.8rem;letter-spacing:1px">
        <caption style="caption-side:bottom;padding:10px;font-weight:bold">
            Observaciones del Ticket
        </caption>
        <tr>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Observacion</th>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Equipos usados de acuerdo a la reserva</th>
        </tr>
        <td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${data.observaciones}</td>
        <td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${data.equipos_usados}</td>
        </table>
        </div>

        ${!(data.imagePath.includes("Ninguno"))?`
            <h5>Imagen tomada en el ticket</h5>
            <img src="cid:${data.id_ticket}" alt="ticket" width="200px"/>
            `:""}
        <p>Este correo declara que la persona que realiza la reserva es el responsable de cualquier daño,evento o fallo de los equipos usados. En caso de daño el responsable se hará cargo de la reparación o en el peor de los casos la adquisición del reemplazo</p><br>
            <h4>Laboratorio de instrumentación Industrial</h4>
            <p>Departamento de automatización y control</p>
            <small>Escuela Politécnica Nacional</small>` 
    }   
    const result = await Send_email(DataEmailToSend.html,DataEmailToSend.asunto,DataEmailToSend.from,DataEmailToSend.password,DataEmailToSend.To, DataEmailToSend.attachments)
    return result
}

