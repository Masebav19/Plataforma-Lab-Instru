import "./menu.css"
function Menu({ SetAction }){

    function HandleSubmit(option=""){
        SetAction(option) 
    }
    return(
        <>
            <div className="InfoMenu">
                <h2>Seleccione lo que desea realizar</h2>
                <h5>De las opciones presentadas escoger: Prestamo o Detalle</h5>
                <p><strong>Prestamo:</strong> Se ingresa para solicitar el prestamo o devolución de un equipo</p>
                <p><strong>Detalle:</strong> Presenta un detalle de todos los eventos generados. Solo puede ingresar un usuario con permisos de adminitración</p>
            </div>
            <div className="Optioncontainer">
                <div className="Option" onClick={()=>HandleSubmit("Prestamo")}>
                    <img src="../src/assets/prestamo.svg" alt="" />
                    <div className="optionValue">Préstamo/Devolción</div>
                </div>
                <div className="Option" onClick={()=>HandleSubmit("Detalle")}>
                    <img src="../src/assets/detalle.svg" alt="" />
                    <div className="optionValue">Detalle</div>
                </div>
            </div>
        </>
    )
}
export default Menu