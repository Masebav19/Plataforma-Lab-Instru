import Panel from './components/panel.jsx'

function App() {
  const VITE_SERVER_URL = "http://172.31.33.23"
  const PORT = 5000
  return (
    <>
      <header>
        <h1>Laboratorio de instrumentación industrial</h1>
        <h2>Plataforma de préstamos de equipos</h2>
      </header>
      <main>
        <div className="Main-container">
          <Panel
          VITE_SERVER_URL={VITE_SERVER_URL}
          PORT = {PORT}
          />   
        </div>
      </main>
      <footer>

      </footer>
    </>
  )
}

export default App
