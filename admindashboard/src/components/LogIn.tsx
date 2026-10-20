import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';


import { useRef, type MouseEvent } from "react";
import bcrypt from "bcryptjs";
import RequestsManager from "../util/RequetsManager.ts";

interface LogProps {
    SetLogStatus:React.Dispatch<React.SetStateAction<boolean>>
}
export default function LogComponent ({SetLogStatus}:LogProps){
    const Email = useRef<HTMLInputElement>(null)
    const Password = useRef<HTMLInputElement>(null)

    async function handleLogIn(e:MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        const password = Password.current
        if (!password) return
        const HashedPassword = await bcrypt.hash(password.value,10)
        const URL = "LogIn"
        const METHOD = "POST"
        const BODY = {
            Correo: Email.current?Email.current.value:"",
            Password: HashedPassword
        }
        const data = await RequestsManager({URL,BODY,METHOD})
        if (data?.error) return alert(data.error)
        window.localStorage.setItem('expiresAt',data.expiresAt)
        const now = new Date()
        window.localStorage.setItem('Timestamp',String(now.getTime()))
        if(data.result.User.Tipo==="Administrador") return SetLogStatus(true)
        return alert("Contaseña incorrecta")
    }
    return(
        <Box
        component="div"
        sx={{
            padding:"10px",display:"flex",flexDirection:"column",gap:"10px",
            position:"absolute", width:window.innerWidth>670?"25vw":"70vw", height:"50vh",
            inset:"0", margin:"auto"
        }}
        >
            <TextField
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
            label="Password"
            type="password"
            sx={{width:"100%",fontSize:"10px"}}
            inputRef={Password}
            />
            <Box
            component="div"
            sx={{display:"flex",justifyContent:"center",alignItems:"center",padding:"0px 20px 0px 10px"}}
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

            </Box>
        </Box>
    )
}