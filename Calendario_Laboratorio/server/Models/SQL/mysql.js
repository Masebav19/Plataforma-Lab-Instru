import mysql from "mysql2/promise.js"
import { v4 as uuidv4 } from 'uuid'
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()
const SQL_URL = process.env.SQL_URL

export default class MySQLClient{
    constructor(){
        this.Client = mysql
    }
    async getSession({year,month,date}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const result = await con.query("SELECT * FROM sesiones WHERE Year = ? AND Month = ? AND Date = ?",[year,month,date])
        await con.end()
        return result[0] || []
    }
    async getSessionbymonth ({year,month}){
        //const client = await mysql.createConnection("mysql://root:@localhost:3306")
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const result = await con.query("SELECT * FROM sesiones WHERE Year = ? AND Month = ?",[year,month-1])
        await con.end()
        return result[0] || []
    }

    async getSeeesionbyWeek({year,month,date,laboratorio}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const DateWeek = new Date(year,month,date)
        const LastDayWeek = new Date(year,month,date+7)
        if(DateWeek.getMonth()=== LastDayWeek.getMonth()){
            if(laboratorio !== "general"){
                const response = await con.query("SELECT * FROM sesiones WHERE laboratorio = ? AND Year = ? AND Month = ? AND Date BETWEEN ? AND ?",
                    [laboratorio,year,month,date,date+7]
                )
                if(response[0].length > 0) {
                    await con.end()
                    return response[0]
                }
                await con.end()
                return []
            }else{
                const response = await con.query("SELECT * FROM sesiones WHERE (laboratorio = 'sensores' OR laboratorio = 'instru') AND Year = ? AND Month = ? AND Date BETWEEN ? AND ? AND LOWER(Asunto) NOT LIKE '%Reserva%'",
                    [year,month,date,date+7]
                )
                if(response[0].length > 0) {
                    await con.end()
                    return response[0]
                }
                await con.end()
                return []
            }
        }else{
            if(laboratorio !== "general"){
                const response = await con.query("SELECT * FROM sesiones WHERE laboratorio = ? AND Year = ? AND Month = ? AND Date BETWEEN ? AND ?",
                    [laboratorio, year,month,date,31]
                )
                const response2 = await con.query("SELECT * FROM sesiones WHERE laboratorio = ? AND Year = ? AND Month = ? AND Date BETWEEN ? AND ?",
                    [laboratorio, year,month+1,1,LastDayWeek.getDate()]
                )
                if(response2[0].length > 0 && response[0].length > 0) {
                    await con.end()
                    return [...response[0],...response2[0]]
                }
                await con.end()
                return []
            }else{
                const response = await con.query("SELECT * FROM sesiones WHERE (laboratorio = 'sensores' OR laboratorio = 'instru') AND Year = ? AND Month = ? AND Date BETWEEN ? AND ? AND LOWER(Asunto) NOT LIKE '%Reserva%'",
                    [year,month,date,31]
                )
                const response2 = await con.query("SELECT * FROM sesiones WHERE (laboratorio = 'sensores' OR laboratorio = 'instru') AND Year = ? AND Month = ? AND Date BETWEEN ? AND ? AND LOWER(Asunto) NOT LIKE '%Reserva%'",
                    [year,month+1,1,LastDayWeek.getDate()]
                )
                if(response2[0].length > 0 && response[0].length > 0) {
                    await con.end()
                    return [...response[0],...response2[0]]
                }
                await con.end()
                return []
            }
        }

    }
    async holadaybymonth ({year,month}){
        //const client = await mysql.createConnection("mysql://root:@localhost:3306")
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const result = await con.query("SELECT * FROM feriados WHERE Year = ? AND Month = ?",[year,month-1])
        await con.end()
        return result[0] || []
    }

    async CreateMultpleSessions({sessions}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const result = await con.query(`INSERT INTO sesiones (Asunto, Hora_inicial, Hora_final, Periodicidad, Responsable, Correo_responsable, Year, Month, Date, fecha_inicio, Mesas, Equipos_usados,laboratorio) VALUES ${sessions.map(session =>{
            return `('${session.Asunto}','${session.Hora_inicial}','${session.Hora_final}','${session.Periodicidad}','${session.Responsable}','${session.Correo_responsable}',${session.Year},${session.Month},${session.Date},'${session.fecha_inicio}','${session.Mesas}','${session.Equipos_usados}','${session.laboratorio}')`
        }).join(",")}`)
        await con.end()
        return result[0] ? true : false
    }

    async DeleteSession({Id}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const IsThaSession = await con.query("SELECT * FROM sesiones WHERE Id = ?",[Id])
        if(!Boolean(IsThaSession[0][0]?.Correo_responsable)) {
            await con.end()
            return {error: "No existe la session"}
        }
        await con.query("DELETE FROM ticket WHERE id_session = ?",[Id])
        const result = await con.query("DELETE FROM sesiones WHERE iD = ?",[Id])
        await con.end()
        return result[0] ? result[0] : {error: "No se puede borrar la session"}
    }

    async SignUp({Nombre, Apellido, Correo, Tipo, Password}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const UserExist = await con.query("SELECT * FROM integrantes WHERE correo = ?",[Correo])
        if(UserExist[0].length > 0) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [UserExist[0][0].UUID, Correo, Nombre, Apellido, "Creacion de usuario fallida: El usuario ya existe"])
            await con.end()
            return {error: "El usuario ya existe"}
        }

        const UUID = uuidv4()
        const result = await con.query("INSERT INTO integrantes (UUID, Nombre, Apellido, correo, Tipo) VALUES (?,?,?,?,?)",
            [UUID, Nombre, Apellido, Correo, Tipo])
        if(result[0].affectedRows === 0) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [UUID, Correo, Nombre, Apellido, "Creacion de usuario fallida: No se pudo crear el usuario"])
            await con.end()
            return {error: "No se pudo crear el usuario"}
        }
        const result2 = await con.query("INSERT INTO credenciales (UUID, password) VALUES (?,?)",[UUID, Password])
        if(result2[0].affectedRows === 0) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [UUID, Correo, Nombre, Apellido, "Creacion de usuario fallida: No se pudo crear la contraseña"])
            con.query("DELETE FROM integrantes WHERE UUID = ?",[UUID])
            await con.end()
            return {error: "No se pudo crear la contraseña"}
        }
        await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
            [UUID, Correo, Nombre, Apellido, "Creacion de usuario: Exitosa"])
        await con.end()
        return {result: Correo,Id: UUID, User: {Apellido, Nombre, Tipo, UUID, correo: Correo}}
    }

    async LogIn({Correo, Password}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const UserExist = await con.query("SELECT * FROM integrantes WHERE correo = ?",[Correo])
        if(UserExist[0].affectedRows === 0) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                ["NA", Correo, "NA", "NA", "LogIn: No se encontró el usuario"])
            await con.end()
            return {error: "El usuario no existe"}
        }
        const UUID = UserExist[0][0].UUID
        const PasswordExist = await con.query("SELECT * FROM credenciales WHERE UUID = ?",[UUID])
        if(!(await bcrypt.compare(PasswordExist[0][0].password,Password))) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [UserExist[0][0].UUID, Correo, UserExist[0][0].Nombre, UserExist[0][0].Apellido, "LogIn: Contraseña Incorrecta"])
            await con.end()
            return {error: "La contraseña es incorrecta"}
        }

        await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
            [UserExist[0][0].UUID, Correo, UserExist[0][0].Nombre, UserExist[0][0].Apellido, "LogIn: Exitoso"])
        await con.end()
        return {result: Correo, Id: UserExist[0][0].UUID, User: UserExist[0][0]}
    }
    async DeleteUser({Correo, Password}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const UserExist = await con.query("SELECT * FROM integrantes WHERE correo = ?",[Correo])
        if(UserExist[0].affectedRows === 0) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                ["NA", Correo, "NA", "NA", "Borrar usuario: No se encontró el usuario"])
            await con.end()
            return {error: "El usuario no existe"}
        }
        const UUID = UserExist[0][0].UUID
        const PasswordExist = await con.query("SELECT * FROM credenciales WHERE UUID = ?",[UUID])
        if(PasswordExist[0][0].password !== Password) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [PasswordExist[0][0].UUID, Correo, PasswordExist[0][0].Nombre, PasswordExist[0][0].Apellido, "Borrar usuario: Contraseña incorrecta"])
            await con.end()
            return {error: "La contraseña es incorrecta"}
        }
        await con.query("DELETE FROM credenciales WHERE UUID = ?",[UUID])
        await con.query("DELETE FROM integrantes WHERE UUID = ?",[UUID])

        await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [UserExist[0][0].UUID, Correo, UserExist[0][0].Nombre, UserExist[0][0].Apellido, "Borrar usuario: Exitoso"])
        await con.end()
        return {result: true}
    }
    async OpenTicket({Correo, Asunto, Fecha}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const UserExist = await con.query("SELECT * FROM integrantes WHERE correo = ?",[Correo])
        if(UserExist[0].affectedRows === 0) {
            await con.end()
            return {error: "El usuario no existe"}
        }
        const SessionDate = new Date(Fecha)
        const SessionYear = SessionDate.getFullYear()
        const SessionMonth = SessionDate.getMonth()+1
        const SessionDay = SessionDate.getDate()
        const SessionExist = await con.query("SELECT * FROM sesiones WHERE Year = ? AND Month = ? AND Date = ? AND Asunto = ?",
            [SessionYear, SessionMonth, SessionDay, Asunto])
        if(!SessionExist[0][0]?.Id) {
            await con.end()   
            return {error: "La sesión no existe"}
        }
        const UUID = UserExist[0][0].UUID
        const TicketID = nanoid()
        const registerDate = (new Date()).toString()
        const result = await con.query("INSERT INTO ticket (id_ticket, id_session, UUID_usuario, fecha_registro) VALUES (?,?,?,?)",
            [TicketID, SessionExist[0][0].Id, UUID, registerDate])
        if(result[0].affectedRows === 0) {
            await con.end()
            return {error: "No se pudo crear el ticket"}
        }
        const result2 = await con.query("SELECT * FROM ticket where id_session=?",[SessionExist[0][0].Id])
        await con.end()
        return {result: result2[0][0]}
    }

    async CloseTicket({observaciones, equipos_usados, id_ticket, imagePath}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const TicketExist = await con.query("SELECT * FROM ticket WHERE id_ticket = ?",[id_ticket])
        if(TicketExist[0].affectedRows === 0) {
            await con.end()
            return {error: "El ticket no existe"}
        }
        const cierreDate = (new Date()).toString()
        const result = await con.query("UPDATE ticket SET fecha_cierre = ?, observaciones = ?, image_path = ?, equipos_usados = ? WHERE id_ticket = ?"
            ,[cierreDate, observaciones, imagePath || "Ninguno", equipos_usados, id_ticket])
        if(result[0].affectedRows === 0) {
            await con.end()
            return {error: "No se pudo cerrar el ticket"}
        }
        if(!(observaciones.includes("Ninguno"))){
            const session_data = await con.query("SELECT * FROM sesiones WHERE Id=?",[TicketExist[0][0].id_session])
            await con.end()
            return{result:true, session_data:session_data[0][0]}
        }
        await con.end()
        return {result: true}
    }
    async ReadNewTickets(){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const NewTickets = await con.query("SELECT * FROM ticket INNER JOIN sesiones ON sesiones.`Id` = id_session WHERE fecha_cierre IS NULL")
        await con.end()
        if(NewTickets[0].affectedRows === 0) {  
            return {error: "No existen tickets abiertos"}
        }
        return {result: NewTickets[0]}

    }
    async ReadClosedTickets(){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const ClosedTickets = await con.query("SELECT * FROM ticket INNER JOIN sesiones ON sesiones.`Id` = id_session WHERE fecha_cierre IS NOT NULL")
        await con.end()
        if(ClosedTickets[0].affectedRows === 0) return {error: "No existen tickets abiertos"}
        return {result: ClosedTickets[0]}
    }
    async GetImageTicket({id_ticket}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const PathImage = await con.query("SELECT image_path FROM ticket WHERE id_ticket = ?",[id_ticket])
        await con.end()
        if(PathImage[0].length === 0) return {error: "No existe ticket"}
        return {ImagePath: PathImage[0][0].image_path}
    }

    async GetActualSession({laboratorio}){
        const con = await this.Client.createConnection(SQL_URL)
        const now = new Date()
        const Year = now.getFullYear()
        const Month = now.getMonth()
        const date = now.getDate()
        const hour = `${now.getHours().toString().padStart(2,"0")}:00`
        await con.connect()
        await con.query("USE instrucalendar")
        const query = await con.query("SELECT * FROM sesiones WHERE Year = ? AND Month = ? AND Date = ? AND Hora_inicial = ?",
            [Year,Month,date, hour]
        )
        await con.end()
        if(query[0].length > 0) {
            if(query[0].length === 1)return {session: query[0]}
            const actualSession = query[0].find(session =>{
                return session.laboratorio === laboratorio
            })
            if(actualSession?.length > 0) return{session: [actualSession]}
            return{ session: [query[0][Math.round((query[0].length-1)*Math.random())]] }
        }
        return {error: "No session"}

    }
    async RegDeviceSession({IdSession, Device}){
        const con = await this.Client.createConnection(SQL_URL)
        await con.connect()
        await con.query("USE instrucalendar")
        const SessionQuery = await con.query("SELECT * FROM sesiones WHERE Id=?",[IdSession])
        const Observaciones = SessionQuery[0][0].Equipos_usados
        let NewObservacion = ""
        if(Observaciones === "Ninguno"){
            NewObservacion = `${Device.Id},${Device.codigo}`
        }else{
            NewObservacion = `${Observaciones};${Device.Id},${Device.codigo}`
        }
        const query = await con.query("UPDATE sesiones SET Equipos_usados = ? WHERE Asunto = ? AND Year = ? AND Month = ? AND Date = ?",
            [NewObservacion,SessionQuery[0][0].Asunto,SessionQuery[0][0].Year,SessionQuery[0][0].Month,SessionQuery[0][0].Date])
        await con.end()
        if(query[0].affectedRows > 0) return {result: true} 
        return {error: true}
    }
}