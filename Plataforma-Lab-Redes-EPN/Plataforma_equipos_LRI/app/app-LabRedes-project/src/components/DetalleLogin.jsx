import bcrypt from "bcryptjs-react"

function DetalleLogin({SetUser}){
    function HandleSubmit(e){
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form)
        const Formdata = Object.fromEntries(formData.entries())
        const PasswoorEncrypted = bcrypt.hashSync(Formdata.InputPaswoord,10)
        sendReuqest(Formdata.User,PasswoorEncrypted).then((result)=>{
            if(result?.User) SetUser(result.User)
            else alert("Credenciales erroneas!!")
        })
        
    }

    async function sendReuqest(User,Password){
        const result = await fetch('http://172.31.33.34:5000/api/detalle',{
            method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({
                User: User,
                Password: Password   
            })
        })
        const res = await result.json()
        return res
    }


    return(
        <>
            <header>
                <h1>Laboratorio de instrumentación Industrial</h1>
            </header>
            <article>
                <h2>Detalle de prestamos y devoluciones</h2>
                <h3>Ingrese el usuario y contraseña</h3>
            </article>
            <span>
                <form  method="POST" onSubmit={HandleSubmit}>
                    <fieldset>
                        <div className="group">
                            <img  className="icon" src="../public/user.svg" alt="User" />
                            <input className="input" name='User' placeholder="Usuario"/>
                        </div>
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

export default DetalleLogin