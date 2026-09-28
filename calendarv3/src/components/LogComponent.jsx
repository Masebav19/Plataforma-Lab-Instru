import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import AddIcon from '@mui/icons-material/Add';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import { useRef, useState } from "react";
import bcrypt from "bcryptjs";
import RequestsManager from "../util/RequetsManager";

export default function LogComponent ({SetUser,VITE_SERVER_URL, PORT,SetStep,SetLogInDialog}){
    const [LogType,SetLogType] = useState("LogIn")
    const Name = useRef(undefined)
    const Email = useRef(undefined)
    const Password = useRef(undefined)
    const Tipo = useRef(undefined)

    async function handleLogIn(e){
        e.preventDefault()
        if(LogType === "LogIn"){
            const HashedPassword = await bcrypt.hash(Password.current.value,10)
            const URL = "LogIn"
            const METHOD = "POST"
            const BODY = {
                Correo: Email.current.value,
                Password: HashedPassword
            }
            const data = await RequestsManager({VITE_SERVER_URL,PORT,URL,BODY,METHOD})
            if (data?.error) return alert(data.error)
            window.localStorage.setItem('expiresAt',data.expiresAt)
            try{
                SetStep(1)
            }catch{
                SetLogInDialog(false)
            }finally{
                return SetUser(data.result)
            }
                
        }else if(LogType === "SignUp"){
            if(Name.current.value.split(" ").length < 2){
                alert(`Colocar el un nombre y un apellido separados por espacio`)
                return 
            } 
            const URL = "SignUp"
            const METHOD = "POST"
            const BODY = {
                Correo: Email.current.value,
                Password: Password.current.value,
                Nombre: Name.current.value.split(" ")[0],
                Apellido: Name.current.value.split(" ")[1],
                Tipo: Tipo.current.value

            } 
            const data = await RequestsManager({VITE_SERVER_URL,PORT,URL,BODY,METHOD})
            if (data?.error) return alert(data.error)
            window.localStorage.setItem('expiresAt',data.expiresAt)
            try{
                SetStep(1)
            }catch{
                SetLogInDialog(false)
            }finally{
                return SetUser(data.result)
            }
        }

    }
    return(
        <Box
        component="section"
        sx={{padding:"10px",display:"flex",flexDirection:"column",gap:"10px"}}
        >
            {LogType==="SignUp"&&
                <TextField
                disabled={LogType!=="LogIn"&&LogType!=="SignUp"}  
                type="text"
                label="Nombre y Apellido"
                sx={{width:"100%",fontSize:"10px"}}
                inputRef={Name}
                />
            }
            <TextField
            disabled={LogType!=="LogIn"&&LogType!=="SignUp"}
            type="email"
            label="Email"
            slotProps={{
                input: {
                    startAdornment: (
                    <InputAdornment position="start">
                        <AccountCircle />
                    </InputAdornment>
                    ),
                },
            }}
            sx={{width:"100%",fontSize:"10px"}}
            inputRef={Email}
            />
            <TextField
            disabled={LogType!=="LogIn"&&LogType!=="SignUp"}
            label="Password"
            type="password"
            sx={{width:"100%",fontSize:"10px"}}
            inputRef={Password}
            />

            <FormControl sx={{minWidth: "100%" }}>
                <InputLabel id={`label`}>Tipo</InputLabel>
                <Select
                aria-describedby={`helper-text`}
                labelId={`label`}
                label="Age"
                 inputRef={Tipo}
                >
                <MenuItem value={"Docente"}>Docente</MenuItem>
                <MenuItem value={"Técnico"}>Tecnico docente</MenuItem>
                </Select>
            </FormControl>
            <Box
            component="div"
            sx={{display:"flex",justifyContent:"space-between",padding:"0px 20px 0px 10px"}}
            >
                <IconButton 
                sx={{borderRadius:"6px", 
                    height:"2vh", fontSize:"16px",
                    padding:"15px"
                }}
                color="primary"
                onClick={handleLogIn}
                >
                    <LoginIcon
                    sx={{height:"3vh"}}
                    />
                    Next
                </IconButton>
                <IconButton 
                sx={{borderRadius:"6px", 
                    height:"2vh", fontSize:"16px",
                    padding:"15px"
                }}
                color="secondary"
                onClick={()=>{
                    LogType==="LogIn"?SetLogType("SignUp"):SetLogType("LogIn")
                }}
                >
                    <AddIcon
                    sx={{height:"3vh"}}
                    />
                    {LogType==="LogIn"?"SingUp":"LogIn"}
                </IconButton>

            </Box>
        </Box>
    )
}