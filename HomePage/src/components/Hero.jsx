import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <img
        src="../src/assets/hero-lab.webp"
        alt="Vista panoramica del Laboratorio de Instrumentacion Industrial de la EPN"
        className="hero-image"
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Facultad de Ingenieria Electrica y Electronica
        </div>
        <h1 className="hero-title">
          Laboratorio de Instrumentacion Industrial
        </h1>
        <p className="hero-description">
          Formacion practica en medicion, control y automatizacion de procesos
          industriales para los futuros ingenieros del Ecuador.
        </p>
      </div>
    </section>
  )
}
