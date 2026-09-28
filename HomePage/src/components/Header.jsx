
import './Header.css'

export default function Header({Option,SetOption,APP_IP}) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-area">
          {window.innerWidth > 670 && <div className="logo-icon">LII</div>}
          <div className="logo-text">
            <span className="logo-title">Laboratorio de Instrumentacion</span>
            <span className="logo-subtitle">Escuela Politecnica Nacional</span>
          </div>
        </div>

        <nav className={`nav-links`}>
          <div  className={`nav-link${`${Option===`http://${APP_IP}:5173`?" Selected":""}`}`} onClick={() => {
            if (window.innerWidth > 900){
              if((!Option) || (Option !==`http://${APP_IP}:5173`))SetOption(`http://${APP_IP}:5173`)
              else SetOption(undefined)
            }else{
              window.open(`http://${APP_IP}:5173`)
            }
            }}>
            Prestamos
          </div>
          <div  className={`nav-link${`${Option===`https://${APP_IP}:5174`?" Selected":""}`}`} onClick={() => {
            if (window.innerWidth > 900){
              if((!Option) || (Option !== `https://${APP_IP}:5174`))SetOption(`https://${APP_IP}:5174`)
              else SetOption(undefined)
            }else{
              window.open(`https://${APP_IP}:5174`)
            }
            }}>
            Calendario
          </div>
        </nav>
      </div>
    </header>
  )
}
