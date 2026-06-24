import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"

dotenv.config()
const DIRNAME = process.cwd()
const app = express()
app.use(cors())

app.use(express.static(path.join(DIRNAME,'public')))


app.get("/", (req,res)=>{
    res.sendFile(path.join(DIRNAME,'views','index.html'))
})

app.listen(process.env.SERVER_PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.SERVER_PORT}`)
})