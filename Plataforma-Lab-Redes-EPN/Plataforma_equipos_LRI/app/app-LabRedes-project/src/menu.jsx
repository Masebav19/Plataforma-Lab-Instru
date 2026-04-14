
function Menu({ SetAction }){

    function HandleSubmit(e){
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form)
        const Formdata = Object.fromEntries(formData.entries())
        SetAction(Formdata.input) 
    }
    return(
        <>
            <header>
                <h1>Laboratorio de instrumentación industrial</h1>
            </header>
            <article>
                <h2>Plataforma de prestamo de equipos</h2>
                <h3>Seleccione lo que desea realizar</h3>
                <h4>De las opciones presentadas escoger: Prestamo, Devolución o Detalle</h4>
                <p><strong>Prestamo:</strong> Se ingresa para solicitar el prestamo de un equipo</p>
                <p><strong>Devolución:</strong> Se ingresa para devolver el quipo prestado anteriomente</p>
                <p><strong>Detalle:</strong> Presenta un detalle de todos los eventos generados en el prestamo o devolución de los quipos, Solo puede ingresar un usuario con permisos de adminitración</p>
                <p><strong>Mantenimiento:</strong> En caso de realizar mantenimiento de algun equipo</p>
            </article>

            <span>
                <fieldset>
                    <legend>Menu</legend>
                    <form action="POST" onSubmit={HandleSubmit}>
                        <div className="group">
                            <img className="icon" src="../public/menu.svg" alt="" />
                            <input list="option" name="input" className="input" autoComplete="off" required placeholder="Escoja la opción"/>
                                <datalist id="option">
                                    <option value="Prestamo"></option>
                                    <option value="Devolucion"></option>
                                    <option value="Detalle"></option>
                                    <option value="Mantenimiento"></option>
                                </datalist>
                        </div>
                        
                        <div className="group-button">
                            <button>Aplicar</button>
                        </div>
                    </form>
                </fieldset>
                
            </span>
        </>
    )
}
export default Menu