export default async function requestServer ({VITE_SERVER_URL, PORT,rute, type = "GET",data = ""}){
    if(type === "GET"){
        const result = await fetch(`${VITE_SERVER_URL}:${PORT}/api/${rute}`)
        const res = await result.json()
        return res
    }else{
        const result = await fetch(`${VITE_SERVER_URL}:${PORT}/api/${rute}`,{
            method: type,
            headers:{"Content-Type": "application/json"},
            body: data
        })
        const res = await result.json()
        return res
    }
}