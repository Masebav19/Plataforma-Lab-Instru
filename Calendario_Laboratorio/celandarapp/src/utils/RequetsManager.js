export default async function RequestsManager ({VITE_SERVER_URL,PORT,URL, METHOD = "GET", BODY =""}){
    if(METHOD === 'GET'){
        const response = await fetch(`${VITE_SERVER_URL}:${PORT}/calendar/${URL}`)
        const data = await response.json()
        return data
    }else{
        const response = await fetch(`${VITE_SERVER_URL}:${PORT}/calendar/${URL}`, {
            method: METHOD,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(BODY)
        })
        const data = await response.json()
        return data
    }
}