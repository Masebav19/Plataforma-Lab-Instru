import readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"

export default async function readKeyboard() {
    const rl = readline.createInterface({ input,output })

    try {
    const parametro = await rl.question('Esperando registro...');
    
    // Validar que no esté vacío
    if (!parametro.trim()) {
      return {error: 'No se ingresa ninguno valor'}
    }
    const [Id, clave] = parametro.split(';')
    const laboratorio = clave.toLocaleLowerCase()
    if (laboratorio === "instru" || laboratorio === "sensores" || laboratorio === "general") return {Id: parseInt(Id,10),laboratorio}
    if(Id==='c') return {finish: true}
    return {error: 'No Clave'}
    }catch(e){
        return {error: `${e}`}
    }finally{
        rl.close()
    }
}