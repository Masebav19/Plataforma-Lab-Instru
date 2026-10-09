import { useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"

function App() {
  const [Option,SetOption] = useState(undefined)
  return (
    <>
      <Header
      Option={Option} 
      SetOption={SetOption}
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
      />
    </>
  )
}

export default App
