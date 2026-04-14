import { useState } from 'react'
import LogIn from './LogIn.jsx'
import Panel from './panel.jsx'

function App() {
  const [Log,SetLog]= useState("NoLog")
  const VITE_SERVER_URL = "http://172.31.33.25"
  const PORT = 5000
  return (
    <>
      <div className="Major-container">
        {Log === "NoLog" &&<LogIn 
        SetLog = {SetLog}
        VITE_SERVER_URL={VITE_SERVER_URL}
        PORT = {PORT}
        />}
        {Log === "Login" && <Panel
        SetLog = {SetLog}
        VITE_SERVER_URL={VITE_SERVER_URL}
        PORT = {PORT}
        />}        
      </div>

    </>
  )
}

export default App
