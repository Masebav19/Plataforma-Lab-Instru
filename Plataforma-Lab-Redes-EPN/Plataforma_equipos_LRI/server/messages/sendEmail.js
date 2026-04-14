import { Send_email } from '../controllers/emailClient.js'
import  { emailSchema } from './messageSchema.js'

async function SenEmail(data,device,asunto){
    let DataEmailToSend = emailSchema;
    DataEmailToSend.To = DataEmailToSend.To.concat(';',data.email)    
    if (asunto === 'Prestamo'){
        DataEmailToSend.asunto = `Prestamo del Dispositivo: ${device.Especificaciones} ${data.Modelo}`
        DataEmailToSend.html= 
        `<h3>Se ha prestado el siguiente equipo:</h3>
        <table>
        <caption>Dispositivo prestado</caption>
        <tr>
            <th>Modelo</th> 
            <th>Código</th> 
            <th>Nombre responsable</th> 
            <th>Correo</th> 
        </tr>
        <tr>
            <td>${device.Especificaciones} ${data.Modelo}</td>
            <td>${device.codigo}</td>
            <td>${data.Nombre}</td>
            <td>${data.email}</td>
        </tr>
        </table>

        <p>Este correo declara que la persona que realiza el prestamo es el responsable de cualquier daño, evento o fallo del dispositivo. En caso de daño el responsable se hará cargo de la reparación o en el peor de los casos la adquisición del reemplazo</p>

        <p><strong>Laboratorio de instrumentación Industrial</strong></p>
        <small>Departamento de automatización y control</small>
        <small>Escuela Politécnica Nacional</small>`
    }else if (asunto === 'Devolucion'){
        DataEmailToSend.asunto = 'Devolución del Dispositivo'
        DataEmailToSend.html= 
        `<h3>Se ha devuelto el siguiente equipo:</h3>
        <table>
        <caption>Dispositivo Devuelto</caption>
        <tr>
            <th>Modelo</th> 
            <th>Código</th> 
            <th>Correo</th> 
            <th>Observaciones del docente responsable</th> 
        </tr>
        <tr>
            <td>${device.Especificaciones} ${data.Modelo}</td>
            <td>${device.codigo}</td>
            <td>${data.email}</td>
            <td>${data.Observacion}</td>
        </tr>
        </table>
        
        <p><strong>Laboratorio de instrumentación Industrial</strong></p>
        <small>Departamento de automatización y control</small>
        <small>Escuela Politécnica Nacional</small>`
    }else if (asunto === 'NewMantenimiento'){
        DataEmailToSend.asunto = `Inicio de matenimiento`
        DataEmailToSend.html= 
        `<h3>${data.Nombre} realizará el mantenimiento del siguiente dispositivo:</h3>

        <table>
        <caption>Dispositivo en mantenimiento</caption>
        <tr>
            <th>Modelo</th> 
            <th>Correo</th> 
            <th>Actividades a realizar</th> 
        </tr>
        <tr>
            <td>${data.Modelo}</td>
            <td>${data.email}</td>
            <td>${data.Actividades}</td>
        </tr>
        </table>        
        <p><strong>Laboratorio de instrumentación Industrial</strong></p>
        <small>Departamento de automatización y control</small>
        <small>Escuela Politécnica Nacional</small>`
    }else{
        DataEmailToSend.asunto = 'Fin del mantenimiento'
        DataEmailToSend.text= 
        `<h3>Se ha finalizado el mantenimiento del dispositivo:</h3>
         <table>
        <caption>Finalización de mantenimiento</caption>
        <tr>
            <th>Modelo</th> 
            <th>Correo</th> 
            <th>Estado</th> 
        </tr>
        <tr>
            <td>${data.Modelo}</td>
            <td>${data.email}</td>
            <td>${data.Estado}</td>
        </tr>
        </table> 
        
        <p><strong>Laboratorio de instrumentación Industrial</strong></p>
        <small>Departamento de automatización y control</small>
        <small>Escuela Politécnica Nacional</small>`
    }
    
    const result = await Send_email(DataEmailToSend.html,DataEmailToSend.asunto,DataEmailToSend.from,DataEmailToSend.password,DataEmailToSend.To)
    return result
}

export { SenEmail }