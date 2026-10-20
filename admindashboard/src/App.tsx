import { useEffect, useState } from 'react'
import './App.css'
import LogComponent from './components/LogIn'
import { VITE_SERVER_URL, PORT } from './util/constant'
import MenuBar from './components/MenuBar'
import TicketBody from './components/TicketBody'

function App() {
  const [LogStatus, SetLogStatus] = useState(true)
  const [value,SetValue] = useState(0)
  async function handleLogout() {
        const URL = "Logout"
        const response = await fetch(`${VITE_SERVER_URL}:${PORT}/calendar/${URL}`, {
            method: 'POST',  
        })
        const result = await response.json()
        if (result?.result){
            window.localStorage.removeItem('expiresAt')
            window.localStorage.removeItem('Timestamp')
            SetLogStatus(false)
        }
  }

  const setAutologOut = async (expirationTime:number) => {
        setTimeout(() => {
            handleLogout();
        }, expirationTime);
  };

  useEffect(()=>{
    if (LogStatus){
      const expiresAt = window.localStorage.getItem('expiresAt')
        if(expiresAt){
            setAutologOut(parseInt(expiresAt,10))
      }
    }
  },[LogStatus])
  useEffect(()=>{
    const expiresAt = window.localStorage.getItem('expiresAt')
    const Timestamp = window.localStorage.getItem('Timestamp')
    if(expiresAt && Timestamp){
      const elapsedTime = (new Date()).getTime() - parseInt(Timestamp)
      const timeRemaining = parseInt(expiresAt) - elapsedTime 
      if (timeRemaining <= 0) {
        void handleLogout()
        return
      }
      SetLogStatus(true)
      setAutologOut(timeRemaining)
    }
  },[])
  console.log(value)
  return (
    <>
      <header>
        <h2>Laboratorio de instrumentación Industrial</h2>
      </header>
        {!LogStatus && 
         <LogComponent
         SetLogStatus={SetLogStatus}
         />
        }
        {LogStatus &&
        <main>
          <MenuBar
          value={value}
          SetValue={SetValue}
          />
          <div className="ContentContainer">
            {value===0 &&
              <TicketBody/>
            }
          </div>
        </main>
        }
        {LogStatus && 
        <footer>
          <small>Laboratorio de Instrumentación Industrial</small>
          <small><strong>Coordinadora</strong>  <a href="mailto:silvana.gamboa@epn.edu.ec">Dra. Silvana Gamboa</a></small>
        </footer>
        }
    </>
  )
}

export default App
