import dotenv from "dotenv"

dotenv.config()

export default async function Request({ Id = 0,laboratorio="redes" }){
    const response = await fetch(`http://${process.env.SERVER_URL}/calendar/regDevice/${Id}/${laboratorio}`)
    return await response.json()
}
