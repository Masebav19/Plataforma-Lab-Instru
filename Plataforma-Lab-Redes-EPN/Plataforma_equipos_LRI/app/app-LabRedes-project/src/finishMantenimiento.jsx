import { useState,useEffect } from "react"
function Fin({SetLog,SetState,devices}){
    const [email,SetEmail] = useState(devices)
    const [model,SetModel] = useState(devices)

    useEffect(()=>{
        const SetModelo = new Set(devices.map((element)=>{return element.Modelo}))
            let newModelo = [];
            SetModelo.forEach((element)=>{
                newModelo.push({Modelo: element})
        }) 
        const Setemail = new Set(devices.map((element)=>{return element.email}))
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
        const {email,Model,Estado} = Object.fromEntries(formData.entries())
        requestServer(email,Model,Estado).then(result=>{
            if (result.error){
                alert(`Error: ${result.error[0].message}`)
                SetLog("NoLog")
            }else{
                alert("Mantenimiento finalizado con exito revisa tu correo!!")
                SetLog("NoLog")
            }
            
        }).catch((result)=>{
            alert(`Error: ${result.error.message}`)
            SetLog("NoLog")
        })
    }

    async function requestServer (email,Model,Estado){

        const result = await fetch("http://172.31.33.34:5000/api/mantenimiento/end",{
            method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({
                email: email,
                Modelo: Model, 
                Estado: Estado
            })
        })
        const res = await result.json()
        return res
    }

    return(
        <>
            <span>
                <header>
                    <h1>Laboratorio de instrumentación Industrial</h1>
                </header>
                <article>
                    <h2>Finalización del mantenimiento</h2>
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
                            <div className="group-button">
                                <button>Registrar fin de mantenimiento</button>
                            </div>
                            
                        </fieldset>
                    </form>
                </span>
            </span>
        </>
    )
}

export default Fin