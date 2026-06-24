import './App.css'
import { useRef, useState } from 'react'
import CalendarConatiner from './components/CalendarComponent'
import InfoSessionPanel from './components/InfoSessionPanel'
import bcrypt from 'bcryptjs'
import RequestsManager from './utils/RequetsManager.js'
import NewSession from './components/NewSession.jsx'

function App() {
  const [CalendarType, setCalendarType] = useState('month')
  const [SessionSelected, SetSessionSelected] = useState(undefined)
  const [Log, SetLog] = useState({state: false, Status: undefined, session: false})
  const [User,SetUser] = useState("No defined")

  const email = useRef(undefined)
  const password = useRef(undefined)
  const Name = useRef(undefined)
  const Type = useRef(undefined)

  const VITE_SERVER_URL = "http://172.31.33.23"
  const PORT = 4000

  function handleChangeMonth(){
      setCalendarType('month')
  }
  function handleChangeWeek(){
      setCalendarType('week')
  }

  async function handleLog(e){
    e.preventDefault()
    if(User === "LogIn"){
      const HashedPassword = await bcrypt.hash(password.current.value,10)
      const URL = "LogIn"
      const METHOD = "POST"
      const BODY = {
        Correo: email.current.value,
        Password: HashedPassword
      }
      const result = await RequestsManager({VITE_SERVER_URL,PORT,URL,METHOD,BODY})
      SetLog(prev => {
        return {
          ...prev,
          Status: result?.result? undefined:"Error"
        }
      })
      if(result?.result) {
        alert(`Session inciada ${result.result}\nPuede crear session dando click en Nuevo evento o dando click en + en cada día`)
        SetUser({"User": result.result,"UserDetail": result.User})
        SetLog({state: false, Status: undefined, session:false})
      }
      else {
        alert(`${result.error}`)
        SetUser("LogIn")
      }
      
    }else{
      
      if(Name.current.value.split(" ").length < 2){
        alert(`Colocar el un nombre y un apellido separados por espacio`)
        SetLog(prev=> {
          return {
            ...prev,
            Status:'Error'
          }
        })
        Name.current.value = ""
        return 
      }
      const URL = "SignUp"
      const METHOD = "POST"
      const BODY = {
        Correo: email.current.value,
        Password: password.current.value,
        Nombre: Name.current.value.split(" ")[0],
        Apellido: Name.current.value.split(" ")[1],
        Tipo: Type.current.value

      }
      
      const result = await RequestsManager({VITE_SERVER_URL,PORT,URL,METHOD,BODY})
      SetLog(prev => {
        return {
          ...prev,
          Status: result?.result? undefined:"Error"
        }
      })
      if(result?.result) {
        alert(`Session inciada ${result.result}\nPuede crear session dando click en Nuevo evento o dando click en + en cada día`)
        SetUser({"User": result.result})
        SetLog({state: false, Status: undefined, session:false})
      }
      else {
        alert(`${result.error}`)
        SetUser("LogIn")
      }
    }
    
  }

  return (
    <>
    <header>
      <small>Laboratorio de Instrumentación Industrial</small>
      <div id="option-container">
        <span onClick={(e)=> {
          e.preventDefault()
          if(User?.User) SetLog(prev => {
            return{
              ...prev,
              session: true
            }
          })
          else{
            SetLog(prev => {
            return{
              ...prev,
              state: true
            }
          })
          SetUser("LogIn")
          }
        }}>
          <img src="../public/Add.svg" alt="Create" />
          <small>Nuevo evento</small>
        </span>
        <span className={CalendarType=== 'month'? 'selected':''} onClick={handleChangeMonth}>
          <img src="../public/month.svg" alt="" />
          <small>Mes</small>
        </span>
        <span className={CalendarType=== 'week'? 'selected':''} onClick={handleChangeWeek}>
          <img src="../public/week.svg" alt="" />
          <small>Semana Laboral</small>
        </span>
        <span onClick={()=>{
          SetLog(prev => {
            return{
              ...prev,
              state: true,
              session:true
            }
          })
          SetUser("LogIn")
          }}>
          <img src="../public/Log.svg" alt="" />
          <small>Incio/Registro</small>
        </span>
      </div>
      {Log.state &&
        <div className="LogConatiner">
          <span><img src={Log.Status === "Error"?"../public/error.gif":"../public/dog.gif"} alt="" /></span>
          <div className="LogPanel">
            <div className="inputContainer" style={{gridColumn:User==="LogIn"?"1/3":"1/2"}}>
              <label htmlFor="User">Correo electrónico</label>
              <input type="email" id = "User" ref={email} required/>
            </div>
            <div className="inputContainer" style={{gridColumn:User==="LogIn"?"1/3":"2/3"}}>
              <label htmlFor="Password">Password</label>
              <input type="password" id = "Password" ref={password} required/>
            </div>
            {User === "SignUp" &&
            <>
              <div className="inputContainer">
                <label htmlFor="Name">Nombre Completo</label>
                <input type="text" id = "Name" ref={Name} required/>
              </div>
              <div className="inputContainer">
                <label htmlFor="Type">Tipo de usuario</label>
                <input list='ListType' id = "Type" ref={Type} required/>
                <datalist id='ListType'>
                  <option value="Docente">Docente</option>
                  <option value="Técnico">Docente de Laboratorio</option>
                  <option value="Estudiante-Docente">Estudiante del Docente</option>
                  <option value="Estudiante-Técnico">Estudiante de Laboratorio</option>
                </datalist>
              </div>
            </>
            }
            <div className="buttonPanel" style={{gridColumn:User==="LogIn"?"1/3":"1/3"}}>
              <button onClick={handleLog}>Iniciar</button>
              {User === "LogIn"&&<button onClick={()=>{
                SetUser("SignUp")
                SetLog(prev=> {
                  return {
                    ...prev,
                    Status: undefined
                  }
                })
                email.current.value = ""
                password.current.value = "" 
                }}>Registrarse</button>}
              <button onClick={()=>{
                SetUser("No defined") 
                SetLog({state: false, Status: undefined, session:false})}}>Salir</button>
            </div>
          </div>
        </div>
      }

      {User?.User && (Log.session || Log?.session?.NewSessionInfo) &&
        <NewSession 
          Log={Log}
          SetLog={SetLog}
          VITE_SERVER_URL={VITE_SERVER_URL}
          PORT={PORT}
        />
      }
    </header>
    <main>
      <CalendarConatiner
        CalendarType={CalendarType}
        SetSessionSelected = {SetSessionSelected}
        SetLog = {SetLog}
        SetUser = {SetUser}
        User = {User}
        Log = {Log}
        VITE_SERVER_URL={VITE_SERVER_URL}
        PORT={PORT}
      />
      <InfoSessionPanel
      User={User}
      SessionSelected={SessionSelected}
      SetLog={SetLog}
      SetSessionSelected={SetSessionSelected}
      VITE_SERVER_URL={VITE_SERVER_URL}
      PORT={PORT}
      />
    </main>
    <footer>
    <small>Laboratorio de instrumentación Industrial</small>
    <small><strong>Coordinadora: </strong>Silvana del Pilar Gamboa</small>
    <small><strong>Contacto: </strong><a href="mailto://silvana.gamboa@epn.edu.ec">silvana.gamboa@epn.edu.ec</a></small>
    </footer>
      
    </>
  )
}

export default App
