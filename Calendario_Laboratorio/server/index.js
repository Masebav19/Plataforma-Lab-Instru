import express from "express"
import cors from "cors"
import { router } from "./routes/calendar.js"
import dotenv from "dotenv"

dotenv.config()
const server = express()

server.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}))
server.use(express.json())

server.use('/calendar', router)

server.listen(process.env.PORT || 4000,()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.PORT || 4000}`)
})