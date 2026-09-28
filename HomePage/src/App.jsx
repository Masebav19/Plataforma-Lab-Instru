import { useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"

function App() {
  const [Option,SetOption] = useState(undefined)
  const APP_IP = "192.168.1.5"
  return (
    <>
      <Header
      Option={Option} 
      SetOption={SetOption}
      APP_IP={APP_IP}
      />
      <main>
        {Option &&
          <iframe id="Option" title="Opcion Seleccionada"
          src={Option}
          ></iframe>
        }
        <Hero />
      </main>
      <Footer
      Option={Option}
      SetOption={SetOption}
      APP_IP={APP_IP}
      />
    </>
  )
}

export default App
