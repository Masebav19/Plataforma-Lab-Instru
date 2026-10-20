import { VITE_SERVER_URL,PORT } from "./constant.ts"
export default async function RequestsManager (RequestData:{
    METHOD:string,
    BODY: Object,
    URL:string
}={
    METHOD:"GET",
    BODY:"",
    URL:""
}){
    if(RequestData.METHOD === 'GET'){
        const response = await fetch(`${VITE_SERVER_URL}:${PORT}/calendar/${RequestData.URL}`)
        const data = await response.json()
        return data
    }else{
        const response = await fetch(`${VITE_SERVER_URL}:${PORT}/calendar/${RequestData.URL}`, {
            method: RequestData.METHOD,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(RequestData.BODY),   
        })
        const data = await response.json()
        return data
    }
}