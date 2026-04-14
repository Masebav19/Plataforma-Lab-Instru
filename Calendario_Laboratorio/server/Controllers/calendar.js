import {getDaysbyMonth, getDaysbyWeek, NewSession,
    DeleteSession, SignUp, LogIn, DeleteUser, OpenTicket, CloseTicket, ReadNewTickets, ReadClosedTickets, GetImageTicket } from "../util/calendar.js"
import { validateSessionData, validateDeleteSessionData } from "../Schema/sesionSchema.js"
import { validateUserSignUp, validateUserLogIn } from "../Schema/UserSchema.js"
import { SenEmail } from "../messages/sendEmail.js"
import path from "path"

export default class Calendar{
    static async getDaysbyMonth(req,res){
        const { month, year } = req.params
        const daysofMonth = await getDaysbyMonth({month,year})
        res.json(daysofMonth)
    }
    static async getDaysbyWeek(req,res){
        const { month, year, date } = req.params
        const daysofWeek = await getDaysbyWeek({month,year,date})
        res.json(daysofWeek)
    }
    static async NewSession(req,res){
        const validationResult = validateSessionData(req.body)
        if(validationResult.error) return res.json({error: JSON.parse(validationResult.error.message)}).status(400)
        const { Asunto, Hora_inicial, Hora_final, Periodicidad, Responsable, Correo_responsable, fecha_inicio, Mesas,Equipos_usados } = validationResult.data
        const result = await NewSession({Asunto, Hora_inicial, Hora_final, Periodicidad, Responsable, Correo_responsable, fecha_inicio, Mesas,Equipos_usados})
        const data = {email: Correo_responsable, fecha_inicio, Responsable, Hora_inicial, Hora_final, Mesas, Equipos_usados}
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
        res.json({result: result?.result})
    }
    static async LogIn(req,res){
        const ValidateResult = validateUserLogIn(req.body)
        if(ValidateResult.error) return res.json({error: JSON.parse(ValidateResult.error.message)}).status(400)
        const { Correo, Password } = ValidateResult.data
        const result = await LogIn({Correo, Password})
        if(result?.error) return res.json({error: result.error}).status(400)
        res.json(result)
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
        const { Correo, Asunto, Fecha } = req.body
        const result = await OpenTicket({Correo, Asunto, Fecha})
        if(result?.error) return res.json({error: result.error}).status(400)
        res.json({result: result?.result})
    }
    static async CloseTicket(req,res){
        const {observaciones, equipos_usados, id_ticket}= req.body
        const imagePath = req?.file?.path || "Ninguno"
        const result = await CloseTicket({observaciones, equipos_usados, id_ticket, imagePath})
        if(result?.error) return res.json({error: result.error}).status(400)
        if(!(observaciones.includes("Ninguno"))){
            const data = {email: result.session_data.Correo_responsable, 
                fecha_inicio: result.session_data.fecha_inicio, 
                Responsable: result.session_data.Responsable, 
                Hora_inicial:  result.session_data.Hora_inicial, 
                Hora_final: result.session_data.Hora_final, 
                Mesas: result.session_data.Mesas, 
                Equipos_usados: result.session_data.Equipos_usados,
                observaciones,
                imagePath,
                equipos_usados
            }
            await SenEmail(data,"Ticket")
            return res.json({result: result?.result})
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
        const ImagePath = path.join(process.cwd(),Path.ImagePath)
        res.sendFile(ImagePath)
    }
}