import {getDaysbyMonth, getDaysbyWeek, NewSession,
    DeleteSession, SignUp, LogIn, DeleteUser, OpenTicket, CloseTicket, ReadNewTickets, ReadClosedTickets, GetImageTicket, 
    getActualSession,
    RegDeviceSession} from "../util/calendar.js"
import { validateSessionData, validateDeleteSessionData } from "../Schema/sesionSchema.js"
import { validateUserSignUp, validateUserLogIn,validateNewTicket } from "../Schema/UserSchema.js"
import { SenEmail } from "../messages/sendEmail.js"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

export default class Calendar{
    static async getDaysbyMonth(req,res){
        const { month, year } = req.params
        const daysofMonth = await getDaysbyMonth({month,year})
        res.json(daysofMonth)
    }
    static async getDaysbyWeek(req,res){
        const { month, year, date, laboratorio } = req.params
        const daysofWeek = await getDaysbyWeek({month,year,date,laboratorio})
        res.json(daysofWeek)
    }
    static async NewSession(req,res){
        const validationResult = validateSessionData(req.body)
        if(validationResult.error) return res.json({error: JSON.parse(validationResult.error.message)}).status(400)
        const { Asunto, Hora_inicial, Hora_final, Periodicidad, Responsable, Correo_responsable, fecha_inicio,Equipos_usados,laboratorio } = validationResult.data
        const result = await NewSession({Asunto, Hora_inicial, Hora_final, Periodicidad, Responsable, Correo_responsable, fecha_inicio,Equipos_usados,laboratorio})
        const data = {email: Correo_responsable, fecha_inicio, Responsable, Hora_inicial, Hora_final, Equipos_usados}
        if (Asunto.toLocaleLowerCase().includes("reserva")) await SenEmail(data,Asunto)
        res.json({success: result})
    }
    static async DeleteSession(req,res){
        const ValidateResult = validateDeleteSessionData(req.body)
        if(ValidateResult.error) return res.json({error: JSON.parse(ValidateResult.error.message)}).status(400)
        const { Id } = ValidateResult.data
        const result = await DeleteSession({Id})
        if(result?.error) return res.json({error: result.error})
        res.json({success: result})
    }

    static async SignUp(req,res){
        const ValidateResult = validateUserSignUp(req.body)
        if(ValidateResult.error) return res.json({error: JSON.parse(ValidateResult.error.message)}).status(400)
        const { Nombre, Apellido, Correo, Tipo, Password } = ValidateResult.data
        const result = await SignUp({Nombre, Apellido, Correo, Tipo, Password})
        if(result?.error) return res.json({error: result.error}).status(400)
        const token = jwt.sign({id: result.Id},process.env.JWT_SECRET,{
            expiresIn: "2m"
        })
        res.cookie('access_token',token,{
             // El frontend no puede leerla (mitiga ataques XSS)
            sameSite: 'strict', // Protege contra ataques CSRF
            maxAge: 2 * 60 * 1000
        })
        res.json({result, expiresAt: 2*60*1000})
    }
    static async LogIn(req,res){
        const ValidateResult = validateUserLogIn(req.body)
        if(ValidateResult.error) return res.json({error: JSON.parse(ValidateResult.error.message)}).status(400)
        const { Correo, Password } = ValidateResult.data
        const result = await LogIn({Correo, Password})
        if(result?.error) return res.json({error: result.error}).status(400)
        const token = jwt.sign({id: result.Id},process.env.JWT_SECRET,{
            expiresIn: "2m"
        })
        const expiresAt = 2*60*1000
        res.cookie('access_token',token,{
             // El frontend no puede leerla (mitiga ataques XSS)
            sameSite: 'strict', // Protege contra ataques CSRF
            maxAge: expiresAt
        })
        res.json({result, expiresAt})
    }
    static async Logout(req,res){
        res.clearCookie('access_token')
        res.json({result: true})
    }
    static async DeleteUser(req,res){
        const ValidateResult = validateUserLogIn(req.body)
        if(ValidateResult.error) return res.json({error: JSON.parse(ValidateResult.error.message)}).status(400)
        const { Correo, Password } = ValidateResult.data
        const result = await DeleteUser({Correo, Password})
        if(result?.error) return res.json({error: result.error}).status(400)
        res.json({result: result?.result})

    }
    static async OpenTicket(req,res){
        const validation = validateNewTicket(req.body)
        if(validation?.error) return res.json({error: validation.error.message}).status(400)
        const { Correo, Asunto, Fecha } = validation.data
        const result = await OpenTicket({Correo, Asunto, Fecha})
        if(result?.error) return res.json({error: result.error}).status(400)
        res.json({result: result?.result})
    }
    static async CloseTicket(req,res){
        const {observaciones, equipos_usados, id_ticket}= req.body
        let imagePath = undefined
        if(req?.file){
            const fileName = `${Date.now()}-${req.file.originalname}`;
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME, // Debes crearlo previamente en el panel de MinIO o por código
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            };
            const s3Client = new S3Client({
                region: 'us-east-1', // MinIO requiere una región aunque sea ficticia
                endpoint: `http://${process.env.MINIO_IP||"127.0.0.1"}:9000`, // El puerto de tu contenedor Docker
                forcePathStyle: true, // Necesario para que funcione con IPs locales/MinIO
                credentials: {
                    accessKeyId: 'minioadmin',     // Las mismas credenciales de tu docker-compose
                    secretAccessKey: 'minioadminpassword'
                }
            });
            await s3Client.send(new PutObjectCommand(uploadParams));
            imagePath = `${fileName}`
        }
        const result = await CloseTicket({observaciones, equipos_usados, id_ticket, imagePath})
        if(result?.error) return res.json({error: result.error}).status(400)
        if(!(observaciones.includes("Ninguno"))){
            const data = {email: result.session_data.Correo_responsable, 
                fecha_inicio: result.session_data.fecha_inicio, 
                Responsable: result.session_data.Responsable, 
                Hora_inicial:  result.session_data.Hora_inicial, 
                Hora_final: result.session_data.Hora_final, 
                Equipos_usados: result.session_data.Equipos_usados,
                observaciones,
                imagePath,
                equipos_usados,
                id_ticket
            }
            try{
                await SenEmail(data,"Ticket")

            }finally{
                return res.json({result: result?.result})
            }
        }
        res.json({result: result?.result})
    }
    static async ReadNewTickets(req,res){
        const result = await ReadNewTickets() 
        res.json(result)
    }
    static async ReadClosedTickets(req,res){
        const result = await ReadClosedTickets()
        res.json(result)
    }
    static async GetImageTicket(req,res){
        const { id_ticket } = req.params
        const Path = await GetImageTicket({id_ticket})
        if(Path?.error) return res.json(Path)
        const {ImagePath} = Path
        try{
            const s3Client = new S3Client({
                region: 'us-east-1',
                endpoint: `http://${process.env.MINIO_IP}:9000`,
                forcePathStyle: true,
                credentials: {
                    accessKeyId: 'minioadmin',
                    secretAccessKey: 'minioadminpassword'
                }
            });
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: ImagePath
            };
            const command = new GetObjectCommand(params);
            const minioResponse = await s3Client.send(command);

            res.set('Content-Type', minioResponse.ContentType);
            res.set('Content-Length', minioResponse.ContentLength);
            minioResponse.Body.pipe(res);
        }catch (error) {
            console.error('Error al recuperar la imagen de MinIO:', error);
            
            // Si el error es NoSuchKey, significa que no existe en el bucket
            if (error.name === 'NoSuchKey') {
            return res.status(404).json({ error: 'La imagen no existe' });
            }

            res.status(500).json({ error: 'Error interno del servidor al recuperar la imagen' });
        }
        
    }
    static async RegDevice(req,res){
        const {Id,laboratorio} = req.params
        const session = await getActualSession({laboratorio})
        if(session?.error) return res.json({error: session.error}).status(401)
        const respopnse = await fetch(`${process.env.SERVER_DEVICE}/api/devices`)
        const devices = await respopnse.json()
        const devicoToReg = devices.find(device =>{
            return device.Id === parseInt(Id,10)
        })
        const result = await RegDeviceSession({IdSession: session.session[0].Id, Device: devicoToReg}) 
        result?.result ? res.json({result: result.result}): res.json({error: true}).status(401)     
        
    }
}