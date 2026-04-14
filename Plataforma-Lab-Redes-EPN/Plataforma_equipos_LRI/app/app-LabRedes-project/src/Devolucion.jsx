import { useEffect, useState } from "react"

function Devolucion({data,SetLog,VITE_SERVER_URL,PORT}){
    const [email,SetEmail] = useState(data)
    const [model,SetModel] = useState(data)
    useEffect(()=>{
        const SetModelo = new Set(data.map((element)=>{return element.Modelo}))
            let newModelo = [];
            SetModelo.forEach((element)=>{
                newModelo.push({Modelo: element})
        }) 
        const Setemail = new Set(data.map((element)=>{return element.email}))
            let newEmail = [];
            Setemail.forEach((element)=>{
                newEmail.push({email: element})
        })
        SetEmail(newEmail)
        SetModel(newModelo)
    },[])

    function HandleSubmit(e){
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form)
        const {email,Model,Summary,Responsable,Estado} = Object.fromEntries(formData.entries())
        requestServer(email,Model,Summary,Responsable,Estado).then(result=>{
            if (result.error){
                alert(`Error: ${result.error[0].message}`)
                SetLog("NoLog")
            }else{
                alert("Equipo devuelto con exito revisa tu correo!!")
                SetLog("NoLog")
            }
            
        }).catch((result)=>{
            alert(`Error: ${result.error.message}`)
            SetLog("NoLog")
        })
    }

    async function requestServer (email,Model,Summary,Responsable,Estado){

        const result = await fetch(`${VITE_SERVER_URL}:${PORT}/api/devolucion`,{
            method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({
                email: email,
                Modelo: Model,
                Observacion: Summary,
                DocenteResponsable: Responsable,
                Estado: Estado
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
                <h2>Plataforma de prestamo de equipos</h2>
                <h4>Ingrese todos los campos</h4>
            </article> 
            <span>
                <form action="POST" onSubmit={HandleSubmit}>
                    <fieldset>
                        <legend>Datos para devolución</legend>
                        <div className="group">
                            <img src="../public/email.svg" alt="" className="icon" />
                            <input list="emailList" name="email" placeholder="example@algo.com" 
                            required title="email" autoComplete="off" size="25" className="input"/>
                            <datalist id="emailList">
                                {
                                    email.map((element)=>{
                                        return(
                                            <option key={element.email} value={element.email}></option>
                                        )
                                    })
                                }
                            </datalist>
                        </div>
                        <div className="group">
                            <img src="../public/PLC.svg" alt="" className="icon" />
                            <input list="ModelList" name="Model" placeholder="Modelo" 
                            required title="Modelo" autoComplete="off" className="input"/>
                            <datalist id="ModelList">
                                {
                                    model.map((element)=>{
                                        return(
                                            <option key={element.Modelo} value={element.Modelo}></option>
                                        )
                                    })
                                }
                            </datalist>
                        </div>
                        <div className="group">
                            <img src="../public/state.svg" alt="" className="icon" />
                            <input type="text" name="Estado" placeholder="Estado OK/Bad" 
                            title="Colocar el estado del PLC" required className="input"/>
                        </div>
                        <div className="group">
                            <img src="../public/observation.svg" alt="" className="icon" />
                            <input type="text" name="Summary" placeholder="Observaciones" 
                            title="Colocar una observacion" size="30" required className="input"/>
                        </div>
                        <div className="group">
                            <img src="../public/docente.svg" alt="" className="icon" />
                        <input type="email" name="Responsable" 
                        title="Colocar el correo del docente responsable" size="25" className="input" required/>
                        </div>
                        <div className="group-button">
                            <button>Realizar devolucion</button>
                        </div>
                        
                    </fieldset>
                </form>
            </span>
        </>
    )
}

export default Devolucion