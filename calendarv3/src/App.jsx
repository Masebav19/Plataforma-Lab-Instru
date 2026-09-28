import "./App.css"
import Calendar from "./components/Calendar"
import { VITE_SERVER_URL, PORT, LABORATORIOS } from "./util/constant.js"

function App() {
  
  return (
    <>
      <main>
          <div className="CalendarMajorContainer">
            <div className="CalendarContainer">
              <Calendar
              VITE_SERVER_URL={VITE_SERVER_URL}
              PORT={PORT}
              LABORATORIOS={LABORATORIOS}
              />
            </div>
          </div>
      </main>
    </>
  )
}

export default App
