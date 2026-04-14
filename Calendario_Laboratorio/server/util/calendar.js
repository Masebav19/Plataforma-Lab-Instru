import MySQLClient from "../Models/SQL/mysql.js"

export async function getDaysbyMonth({month, year}){
    const firstdayofmonth = new Date(year,month-1,1)
    const datefirstday = firstdayofmonth.getDay()
    let firstdayofCalendar = undefined
    if (datefirstday > 0){
        firstdayofCalendar = new Date(year,month-1,1-datefirstday)
    }else{
        firstdayofCalendar = firstdayofmonth
    }
    const daysofmonth = []
    const Client = new MySQLClient()
    const sessions = await Client.getSessionbymonth({year,month})
    const holidays = await Client.holadaybymonth({year,month})
    for (let i = 0; i < 5*7;i++){
        const thisInfo = new Date(firstdayofCalendar.getFullYear(),firstdayofCalendar.getMonth(),firstdayofCalendar.getDate()+i)
        const thisYear = thisInfo.getFullYear()
        const thisMonth = thisInfo.getMonth()
        const thisDate = thisInfo.getDate()
        const ThisDay = thisInfo.getDay()
        const ThisSession = sessions.filter((session) => {
            return session.Year === thisYear && session.Month === thisMonth && session.Date === thisDate
        })
        const ThisHoliday = holidays.filter((holiday) =>{
            return holiday.Year === thisYear && holiday.Month === thisMonth && holiday.Date === thisDate
        })
        daysofmonth.push({
            Year: thisYear,
            Month: thisMonth,
            Day: ThisDay,
            Date: thisDate,
            sessions: ThisSession.length > 0 ? ThisSession : undefined,
            feriados: ThisHoliday.length > 0 ? ThisHoliday : undefined
        })
    }
    return daysofmonth
}

export async function getDaysbyWeek({month, year, date}){
    const firstdayofweek = new Date(year,month-1,date)
    const datefirstday = firstdayofweek.getDay()
    let firstdayofCalendar = undefined
    if (datefirstday > 0){
        firstdayofCalendar = new Date(year,month-1,date-datefirstday)
    }else{
        firstdayofCalendar = firstdayofweek
    }
    const daysofweek = []
    const Client = new MySQLClient()
    const sessions = [...(await Client.getSessionbymonth({year,month})),...(await Client.getSessionbymonth({year,month:(Number(month)+1).toString()}))]
    const holidays = [...(await Client.holadaybymonth({year,month})),...(await Client.holadaybymonth({year,month:(Number(month)+1).toString()}))]

    for (let i = 0; i < 7;i++){
        const thisInfo = new Date(firstdayofCalendar.getFullYear(),firstdayofCalendar.getMonth(),firstdayofCalendar.getDate()+i)
        const thisYear = thisInfo.getFullYear()
        const thisMonth = thisInfo.getMonth()
        const thisDate = thisInfo.getDate()
        const ThisDay = thisInfo.getDay()
        const ThisSession = sessions.filter((session) => {
            return session.Year === thisYear && session.Month === thisMonth && session.Date === thisDate
        })
        const ThisHoliday = holidays.filter((holiday) =>{
            return holiday.Year === thisYear && holiday.Month === thisMonth && holiday.Date === thisDate
        })
        daysofweek.push({
            Year: thisYear,
            Month: thisMonth,
            Day: ThisDay,
            Date: thisDate,
            sessions: ThisSession.length > 0 ? ThisSession : undefined,
            feriados: ThisHoliday.length > 0 ? ThisHoliday : undefined
        })
    }
    return daysofweek
}

export async function NewSession({Asunto, Hora_inicial, Hora_final, Periodicidad, Responsable, Correo_responsable, fecha_inicio, Mesas, Equipos_usados}){
    const SessionDateInfo = new Date(fecha_inicio+'T01:00:00')
    const SessionYear = SessionDateInfo.getFullYear()
    const SessionMonth = SessionDateInfo.getMonth()
    const SessionDate = SessionDateInfo.getDate()
    const Client = new MySQLClient()
    const nTimes = Hora_final.split(":")[0]-Hora_inicial.split(":")[0]
    for(let k = 1;k <= nTimes;k++){
        const Hora_inicial_Aux = (Number(Hora_inicial.split(":")[0])+k-1).toString().padStart(2,"0")+":00"
        const Hora_final_Aux = (Number(Hora_final.split(":")[0])-(nTimes-k)).toString().padStart(2,"0")+":00"
        if(Periodicidad === "Semanalmente"){
            const sessions = []
            for (let i = 0; i < 16; i++){
                const ThisSession = new Date(SessionYear,SessionMonth,SessionDate+(i*7))
                sessions.push({
                    Asunto, Periodicidad, Responsable, Correo_responsable,
                    fecha_inicio, Mesas,Equipos_usados,
                    Year: ThisSession.getFullYear(),
                    Month: ThisSession.getMonth(),
                    Date: ThisSession.getDate(),
                    Hora_inicial: Hora_inicial_Aux,
                    Hora_final: Hora_final_Aux

                })
            }
            const result = await Client.CreateMultpleSessions({sessions})
            if(k === nTimes )return result
        }else if(Periodicidad === "Mensualmente"){
            const sessions = []
            for (let i = 0; i < 5; i++){
                const ThisSession = new Date(SessionYear,SessionMonth+i,SessionDate)
                sessions.push({
                    Asunto, Periodicidad, Responsable, Correo_responsable,
                    fecha_inicio, Mesas,Equipos_usados,
                    Year: ThisSession.getFullYear(),
                    Month: ThisSession.getMonth(),
                    Date: ThisSession.getDate(),
                    Hora_inicial: Hora_inicial_Aux,
                    Hora_final: Hora_final_Aux
                })
            }
            const result = await Client.CreateMultpleSessions({sessions})
            if(k === nTimes )return result
        }else if(Periodicidad === "Anualmente"){
            const sessions = []
            for (let i = 0; i < 5; i++){
                const ThisSession = new Date(SessionYear+i,SessionMonth,SessionDate)
                sessions.push({
                    Asunto, Periodicidad, Responsable, Correo_responsable,Equipos_usados,
                    Year: ThisSession.getFullYear(),
                    Month: ThisSession.getMonth(),
                    Date: ThisSession.getDate(),
                    Hora_inicial: Hora_inicial_Aux,
                    Hora_final: Hora_final_Aux,
                    fecha_inicio, 
                    Mesas
                })
            }
            const result = await Client.CreateMultpleSessions({sessions})
            if(k === nTimes )return result
        }else{
            const sessions = []
            sessions.push({
                Asunto, Periodicidad, Responsable, Correo_responsable,Equipos_usados,
                fecha_inicio, Mesas,
                Year: SessionYear,
                Month: SessionMonth,
                Date: SessionDate,
                Hora_inicial: Hora_inicial_Aux,
                Hora_final: Hora_final_Aux            
            })
            const result = await Client.CreateMultpleSessions({sessions})
            if(k === nTimes )return result
        }
    }
    
}

export async function DeleteSession({Id}){
    const Client = new MySQLClient()
    const result = await Client.DeleteSession({Id})
    return result
}

export async function SignUp({Nombre, Apellido, Correo, Tipo, Password}){
    const Client = new MySQLClient()
    const result = await Client.SignUp({Nombre, Apellido, Correo, Tipo, Password})
    return result
}

export async function LogIn({Correo, Password}){
    const Client = new MySQLClient()
    const result = await Client.LogIn({Correo, Password})
    return result
}

export async function DeleteUser({Correo, Password}){
    const Client = new MySQLClient()
    const result = await Client.DeleteUser({Correo, Password})
    return result
}

export async function OpenTicket({Correo, Asunto, Fecha}){
    const Client = new MySQLClient()
    const result = await Client.OpenTicket({Correo, Asunto, Fecha})
    return result
}

export async function CloseTicket({observaciones, equipos_usados, id_ticket, imagePath}){
    const Client = new MySQLClient()
    const result = await Client.CloseTicket({observaciones, equipos_usados, id_ticket, imagePath})
    return result
}

export async function ReadNewTickets(){
    const Client = new MySQLClient()
    const result = await Client.ReadNewTickets()
    return result
}
export async function ReadClosedTickets() {
    const Client = new MySQLClient()
    const result = await Client.ReadClosedTickets()
    return result
}
export async function GetImageTicket({id_ticket}){
    const Client = new MySQLClient()
    const result = await Client.GetImageTicket({id_ticket})
    return result
}