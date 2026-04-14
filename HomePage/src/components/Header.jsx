import { useState } from 'react'
import './Header.css'

export default function Header({Option,SetOption}) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-area">
          <div className="logo-icon">LII</div>
          <div className="logo-text">
            <span className="logo-title">Laboratorio de Instrumentacion</span>
            <span className="logo-subtitle">Escuela Politecnica Nacional</span>
          </div>
        </div>

        <nav className={`nav-links`}>
          <div  className={`nav-link${`${Option===5173?" Selected":""}`}`} onClick={() => {
            if((!Option) || (Option !==5173))SetOption(5173)
            else SetOption(undefined)
            }}>
            Prestamos
          </div>
          <div  className={`nav-link${`${Option===5174?" Selected":""}`}`} onClick={() => {
            if((!Option) || (Option !== 5174))SetOption(5174)
            else SetOption(undefined)
            }}>
            Calendario
          </div>
          <div className={`nav-link${`${Option===5175?" Selected":""}`}`} onClick={() => {
            if((!Option) || (Option !== 5175))SetOption(5175)
            else SetOption(undefined)
            }}>
            Ticket
          </div>
        </nav>
      </div>
    </header>
  )
}
