import { Send_email } from '../Controllers/emailClient.js'
import  { emailSchema } from './messageSchema.js'
import path from "path"
import dotenv from 'dotenv'

dotenv.config()
export async function SenEmail(data={},asunto=""){
    let DataEmailToSend = emailSchema;
    DataEmailToSend.To = DataEmailToSend.To.concat(';',data.email)    
    if (asunto.includes("Reserva")){
        DataEmailToSend.To = DataEmailToSend.To.concat(';',process.env.SECUNDARY_EMAIL_TO) 
        DataEmailToSend.asunto = `Solicitud de reserva del Laboratorio de instrumentación industrial`
        DataEmailToSend.html= 
        `<h2>Se ha realizado una reserva del laboratorio con los siguientes datos:</h2>
        <p><strong>Responsable:</strong> ${data.Responsable}</p>
        <p><strong>Fecha de la reserva:</strong> ${data.fecha_inicio}</p>
        <p><strong>Horario:</strong> ${data.Hora_inicial}- ${data.Hora_final}</p>
        <p><strong>Mesa a reservar:</strong> ${data.Mesas}</p>

        <div style="display:flex;justify-content:center;align-items:center">
        <table style="border-collapse:collapse;border:2px solid rgb(140 140 140);font-family: sans-serif;font-size:0.8rem;letter-spacing:1px">
        <caption style="caption-side:bottom;padding:10px;font-weight:bold">
            Equipos usados en el laboratorio
        </caption>
        <tr>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Equipo</th>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Modelo</th>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Código</th>
        </tr>
        ${data.Equipos_usados.split(";").map(device=>{return `
            <tr>
            ${device.split(',').map(deviceInfo => {return `<td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${deviceInfo}</td>`}).join('\n')}
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
        const filemane = data.imagePath.split(path.sep)[data.imagePath.split(path.sep).length-1]
        const Path = imagePath
        const cid = ticket_image
        DataEmailToSend.attachments = [
            {
                filemane,path:Path,cid
            }
        ]
       }
        DataEmailToSend.html= 
        `<h2>Se ha realizado una observación del ticket</h2>
        <p><strong>Responsable:</strong> ${data.Responsable}</p>
        <p><strong>Fecha de la reserva:</strong> ${data.fecha_inicio}</p>
        <p><strong>Horario:</strong> ${data.Hora_inicial}- ${data.Hora_final}</p>
        <p><strong>Mesa reservadas:</strong> ${data.Mesas}</p>
        <div style="display:flex;justify-content:center;align-items:center">
        <table style="border-collapse:collapse;border:2px solid rgb(140 140 140);font-family: sans-serif;font-size:0.8rem;letter-spacing:1px">
        <caption style="caption-side:bottom;padding:10px;font-weight:bold">
            Equipos usados en el laboratorio
        </caption>
        <tr>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Equipo</th>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Modelo</th>
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Código</th>
        </tr>
        ${data.Equipos_usados.split(";").map(device=>{return `
            <tr>
            ${device.split(',').map(deviceInfo => {return `<td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${deviceInfo}</td>`}).join('\n')}
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
        <th scope="col" style="border: 1px solid rgb(160 160 160);padding: 8px 10px">Equipos usados de acuerdo al ticket</th>
        </tr>
        <td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${data.observaciones}</td>
        <td style="border: 1px solid rgb(160 160 160);padding: 8px 10px">${data.equipos_usados}</td>
        </table>
        </div>

        ${!(data.imagePath.includes("Ninguno"))?`
            <h5>Imagen tomada en el ticket</h5>
            <img src="cid:ticket_image" alt="ticket" width="200px"/>
            `:""}
        <p>Este correo declara que la persona que realiza la reserva es el responsable de cualquier daño,evento o fallo de los equipos usados. En caso de daño el responsable se hará cargo de la reparación o en el peor de los casos la adquisición del reemplazo</p><br>
            <h4>Laboratorio de instrumentación Industrial</h4>
            <p>Departamento de automatización y control</p>
            <small>Escuela Politécnica Nacional</small>` 
    }   
    const result = await Send_email(DataEmailToSend.html,DataEmailToSend.asunto,DataEmailToSend.from,DataEmailToSend.password,DataEmailToSend.To, DataEmailToSend.attachments)
    return result
}

