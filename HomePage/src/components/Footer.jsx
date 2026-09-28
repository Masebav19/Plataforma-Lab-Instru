
import './Footer.css'

export default function Footer({SetOption,APP_IP}) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo-area">
              <div className="footer-logo-icon">LII</div>
              <span className="footer-logo-text">
                Lab. Instrumentacion Industrial
              </span>
            </div>
            <p className="footer-desc">
              Laboratorio de Instrumentacion Industrial de la Facultad de
              Ingenieria Electrica y Electronica, Escuela Politecnica Nacional,
              Quito - Ecuador.
            </p>
          </div>

          {/* Links */}
          <div className="footer-column">
            <p className="footer-column-title">Enlaces</p>
            <div className="footer-link" onClick={()=>{
              if(window.innerWidth > 900)SetOption(`http://${APP_IP}:5173`)
              else window.open(`http://${APP_IP}:5173`)
              }}>
              Prestamos de quipos
            </div>
            <div className="footer-link" onClick={()=>{
              if(window.innerWidth > 900) SetOption(`https://${APP_IP}:5174`)
              else window.open(`https://${APP_IP}:5174`)
              }}>
              Calendario del laboratorio
            </div>
            <a
              href="https://www.epn.edu.ec"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Portal EPN
            </a>
          </div>

          {/* Coordinator */}
          <div className="footer-coordinator">
            <p className="footer-column-title">Coordinadora</p>
            <div className="coordinator-card">
              <div className="coordinator-avatar">SG</div>
              <div className="coordinator-info">
                <span className="coordinator-name">
                  Dra. Silvana Gamboa
                </span>
                <span className="coordinator-role">
                  Coordinadora del Laboratorio de Instrumentacion Industrial
                </span>
                <a
                  href="mailto:silvana.gamboa@epn.edu.ec"
                  className="coordinator-email"
                >
                  silvana.gamboa@epn.edu.ec
                </a>
              </div>
            </div>
            <p className="footer-desc footer-desc--small">
              {'Edificio de Quimica Eléctrica, Sexto Piso, Lab. E002.'}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            {'© 2026 Escuela Politecnica Nacional. Todos los derechos reservados.'}
          </span>
          <span>Quito, Ecuador</span>
        </div>
      </div>
    </footer>
  )
}
