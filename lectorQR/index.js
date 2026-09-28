import readKeyboard from "./Controllers/keyboard.js"
import Request from "./Controllers/Request.js"

while(1){
    const result = await readKeyboard()
    if (result?.Id){
        const {Id,laboratorio} = result
        try{
            const response = await Request({Id,laboratorio})
            console.log(response?.result?"Solicitud enviada":response.error)
            
        }catch(error){
            console.log(error)
        }
    }else if(result.finish){
        break
    }else{
        console.log(result.error)
    }
}