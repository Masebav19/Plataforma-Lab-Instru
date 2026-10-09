
import './Header.css'

export default function Header({Option,SetOption}) {
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
          <div  className={`nav-link${`${Option===`/device`?" Selected":""}`}`} onClick={() => {
            if (window.innerWidth > 900){
              if((!Option) || (Option !==`/device`))SetOption(`/device`)
              else SetOption(undefined)
            }else{
              window.open(`/device`)
            }
            }}>
            Prestamos
          </div>
          <div  className={`nav-link${`${Option===`/calendar`?" Selected":""}`}`} onClick={() => {
            if (window.innerWidth > 900){
              if((!Option) || (Option !== `/calendar`))SetOption(`/calendar`)
              else SetOption(undefined)
            }else{
              window.open(`/calendar`)
            }
            }}>
            Calendario
          </div>
        </nav>
      </div>
    </header>
  )
}
