import { useEffect, useState } from "react"

function Prestamo({data,FilterValue,SetLog,VITE_SERVER_URL,PORT}){
    const [newData, setNewData]= useState(data)
    const [IpLists,SetIps]= useState(newData.map((element)=>{return {Id: element.Id,DirIp:element.DirIp}}))
    function handleFilter(e){
        const form = e.target.value;
        let newFilter = data.map((element)=>{
            if(element.Marca === form) {return element}
        })
        newFilter = newFilter.filter((element)=>{
            return element!==undefined
        })
        setNewData(newFilter)
    }

    function HandleIps(e){
        const Model = e.target.value;
        const IpFilter = newData.filter((element)=>{
            return element.Modelo === Model
        })
        SetIps(IpFilter)
    }

    useEffect(()=>{
        const newIps = newData.map((element)=>{return {Id: element.Id,DirIp:element.DirIp}})
        SetIps(newIps) 
    },[newData])
    function handleDevice(e){
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form)
        const Formdata = Object.fromEntries(formData.entries())
        const {Name, email, Model,DirIp,ExpasionModule} = Formdata;
        requestServer(Name, email, Model,DirIp,ExpasionModule).then(result=>{
            if (result.error){
                alert(`Error: ${result.error[0].message}`)
                SetLog("NoLog")
            }else{
                alert(`Prestamo realizado con exito ${result.Nombre}, revisa tu correo!!`)
                SetLog("NoLog")
            }
            
        }).catch((result)=>{
            alert(`Error: ${result}`)
            SetLog("NoLog")
        })
    }
    async function requestServer (Name, email, Model,DirIp,ExpasionModule){
        const result = await fetch(`${VITE_SERVER_URL}:${PORT}/api/prestamo`,{
            method: 'POST',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({
                Nombre:Name,
                email: email,
                Modelo: Model,
                Direccion_IP: DirIp,
                ModulosExpansion: ExpasionModule
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
                <form action="POST" onSubmit={handleDevice}>
                    <fieldset>
                        <legend>Filtro</legend>
                        <div className="group">
                            <img src="../public/filter.svg" alt="Filtro" className="icon" />
                            <input list="DeviceBrand" name="DeviceBrand" onChange={handleFilter} 
                            title="Puede buscar los dispositivos por Marca, este campo es opcional"
                            placeholder="Marca"
                            className="input"/>
                            <datalist id="DeviceBrand">
                                {
                                FilterValue.map((element)=>{

                                        return(
                                            <option key={element.Marca} value={element.Marca}></option>
                                        )
                                    
                                })
                                
                                }
                            </datalist>
                        </div>
                        
                    </fieldset>
                    <fieldset>
                        <legend>Datos del prestamo</legend>
                        <div className="group">
                            <img src="../public/user.svg" alt="Nombre" className="icon" />
                            <input type="text" name="Name" placeholder="Nombre" 
                            required title="Nombre y apellido" className="input"/>
                        </div>
                        <div className="group">
                            <img src="../public/email.svg" alt="email" className="icon" />
                            <input type="email" name="email" 
                            placeholder="email" required title="email" className="input"/>
                        </div>
                        <div className="group">
                            <img src="../public/PLC.svg" alt="Modelo" className="icon" />
                            <input list="modeloList" name="Model" 
                            placeholder="Modelo" required onChange={HandleIps}
                            className="input"/>
                            <datalist id="modeloList">
                            {
                                newData.map(element=>{
                                    if(element?.Marca){
                                        return(
                                            <option key={element.Id} value={element.Modelo}></option>
                                        )
                                    }
                                    
                                })
                            }
                            </datalist>
                        </div>
                        <div className="group">
                            <img src="../public/IP.svg" alt="" className="icon" />
                            <input list="IpList" name="DirIp" placeholder="Dirección IP/Otros" 
                            title="Dirección IP del dispositivo" autoComplete="off" className="input"/>
                                <datalist id="IpList">
                                    {
                                            IpLists.map(element=>{
                                                if(element?.DirIp){
                                                    return(
                                                        <option key={`${element.Id}-${element.DirIp}`} value={element.DirIp}></option>
                                                    )
                                                }
                                                
                                            })   
                                    }
                            </datalist>
                        </div>
                        <div className="group">
                            <img src="../public/espansionModule.svg" alt="" className="icon" />
                            <input type="text" name="ExpasionModule" placeholder="Módulo de expansión" 
                            title="Si el dispositivo prestado tiene módulo de expasion colocar el modelo del mismo" 
                            required className="input"/>
                        </div>
 
                        <div className="group-button">
                            <button>Realizar prestamo</button>
                        </div>
                        
                    </fieldset>
                </form>
            </span>
        </>
    )
}

export default Prestamo