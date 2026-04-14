import bcrypt from "bcryptjs-react"

function LogIn({SetLog,VITE_SERVER_URL,PORT}){
    
    const RequestLogIn=async (password)=>{
        const Crycptpassword = bcrypt.hashSync(password,10)
        const result = await fetch(`${VITE_SERVER_URL}:${PORT}/api/LogIn`,{
            method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({
                User: 'App',
                Password: Crycptpassword
            })
        })
        const res = await result.json()
        return res
        
    }
    function HandleSubmit(e){
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form)
        const Formdata = Object.fromEntries(formData.entries())
        RequestLogIn(Formdata.InputPaswoord).then((resul)=>{
            resul.LogIn === "Succesfull" ? SetLog("Login"): alert("Credenciales erroneas")
        })
    }
    return (
        <>
            <header>
                <h1>Laboratorio de instrumentación industrial</h1>
            </header>
            <article>
                <h2>Plataforma de prestamos de equipos</h2>
                <h3>Ingrese la contraseña</h3>
            </article>
            <span>
                <form  method="POST" onSubmit={HandleSubmit}>
                    <fieldset>
                        <div className="group">
                            <img  className="icon" src="../public/password.svg" alt="Password" />
                            <input className="input" type="password" name='InputPaswoord' placeholder="Password"/>
                        </div>
                        
                        <div className="group-button">
                        <button>Ingresar</button>
                        </div>
                        
                    </fieldset>
                </form>
            </span>
        </>
    )
}

export default LogIn