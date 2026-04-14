import express from 'express'
import env from './controllers/env.js'
import bcript from 'bcrypt'
import cors from 'cors'
import {create_let_device,create_return_device,read_user_credencials,
    read_available_devices,read_loaned_devices,create_maintance,read_maintance
} from './controllers/MysqlClient.js'
import { SenEmail } from './messages/sendEmail.js'
import { validateLetDevice, validateReturnedDevice,validateNewMaintance,validateEndMaintance} from './Schema/device_schema.js'

const server = express()
server.use(express.json());
server.use(cors());
const venv = env()

// Post de envío de las credenciales de usuario al inicio de la página
server.post('/api/LogIn',async(req,res)=>{
    const data = req.body;
    if (!(data?.User)) return res.json({Login: "NotAllowed"}).status(401)
    const credencials = await read_user_credencials();
    const LogIn = credencials.find((credencial)=>{
        return credencial.Lab_User===data.User && bcript.compareSync(credencial.Lab_Password,data.Password)
    })
    return LogIn ?  res.json({LogIn: "Succesfull"}).status(200): res.json({Login: "NotAllowed"}).status(400)
})
//***************PRESTAMOS*********************************** */
// POST para la recepción de datos del prestamista para la escritura a la base de datos desde el cliente
server.post('/api/prestamo',(req,res)=>{
    const result = validateLetDevice(req.body)
    if (result.error) return res.status(406).json({error: JSON.parse(result.error.message)})
    create_let_device(result.data).then((device)=>{
        SenEmail(result.data,device,'Prestamo').then(() =>{
             return res.json(result.data).status(406)
        })
    }).catch((error)=>{
        return res.json({error:{
            message: "Dato erroneo"
        }}).status(406)
    })
})
//GET para el envío de datos de los dispositivos que están libres
server.get('/api/prestamo',(req,res)=>{
    read_available_devices(true).then(devices=>{
        const DevicesNames = devices.map((device)=>{
            return {
                Id: device.Id,
                Modelo: device.Modelo,
                Marca: device.Marca,
                DirIp: device.Especificaciones,
                codigo: device.codigo,
                Tipo: device.Tipo
            }
        })
        return res.json(DevicesNames).status(200)
    }).catch(()=>{
        return res.json({Response: "Bad Data"}).status(406)
    })
})
//***********DEVOLUCIÓN DE EQUIPOS***************************** */
//POST para la recepción de datos del prestamista para la escritura en la base de datos
server.post('/api/devolucion',(req,res)=>{
    const result = validateReturnedDevice(req.body)
    if (result.error) return res.status(406).json({error: JSON.parse(result.error.message)}) 
    create_return_device(result.data).then(()=>{
        SenEmail(result.data,'Devolucion').then(() =>{
            return res.json(result.data).status(406)
        })
    }).catch(()=>{
        return res.json({error:{
            message: "Dato erroneo"
        }}).status(406)
    })
})
//GET para envío de los dispositivos prestados

server.get('/api/devolucion',(req,res)=>{
    read_loaned_devices('Prestado').then((loanedDevices)=>{
        const filterDevices = loanedDevices.map((loanedDevice)=>{
            return{
                email: loanedDevice.email,
                Modelo: loanedDevice.Modelo
            }
        })
        return res.json(filterDevices).status(200)
    }).catch(()=>{
        return res.json({Response: "Bad Data"}).status(406)
    })
})
//********************DETALLE DE LOS ELEMENTOS PRESTADOS Y DEVUELTOS**************/
//login
server.post('/api/detalle',async(req,res)=>{
    const data = req.body;
    if (!(data?.User)) return res.json({Login: "NotAllowed"}).status(406)
    const credencials = await read_user_credencials();
    const LogIn = credencials.find((credencial)=>{
        return credencial.Lab_User===data.User && bcript.compareSync(credencial.Lab_Password,data.Password)
       
    })
    return LogIn ?  res.json(data).status(200): res.json({Login: "NotAllowed"}).status(400)
})
//Envío de los equipos al cliente
server.get('/api/detalle/:type-:user',(req,res)=>{
    const {type,user} = req.params;
    if(user !== "Admin") return res.status(400).json()
    if (type === 'Prestado'){
        read_loaned_devices("Prestado").then(elements =>{
            return res.json(elements).status(200)
        })
        .catch(()=>{
            return res.status(406).json()
        })
    }else if (type === 'Devuelto'){
        read_loaned_devices("Devuelto").then(elements =>{
            return res.json(elements).status(200)
        })
        .catch(()=>{
            return res.status(406).json()
        })
    }else{
        read_loaned_devices().then(elements =>{
            return res.json(elements).status(200)
        })
        .catch(()=>{
            return res.status(406).json()
        })  
    }
})

/****************INGRESO DE MANTENIMIENTO DE EQUIPOS********/
server.get('/api/newmantenimiento',(req,res)=>{
    read_available_devices().then(elements=>{
        return res.status(200).json(elements)
    }).catch(()=>{
        return res.status(400).json()  
    })
})

server.get('/api/endmantenimiento',(req,res)=>{
    read_maintance().then(elements=>{
        return res.status(200).json(elements)
    }).catch(()=>{
        return res.status(400).json()  
    })
})

server.post('/api/mantenimiento/:action',(req,res)=>{
    const {action} = req.params;
    if (action === 'new'){
        const result = validateNewMaintance(req.body)
        if (result.error) return res.status(406).json({error: JSON.parse(result.error.message)})
        create_maintance(result.data).then((data)=>{
            SenEmail(result.data,'NewMantenimiento').then(() =>{
                return res.json(result.data).status(201)
            })
        }).catch(()=>{
            res.json({error:{
                message: "Dato erroneo"
            }}).status(400)
        })
    }else{
        const result = validateEndMaintance(req.body)
        if (result.error) return res.status(406).json({error: JSON.parse(result.error.message)})
        create_maintance(result.data,action).then((data)=>{
            SenEmail(result.data,'EndMantenimiento').then(() =>{
                return res.json(result.data).status(200)
            })
        }).catch(()=>{
            res.json({error:{
                message: "Dato erroneo"
            }}).status(400)
        })
    }

})
server.listen(venv.VITE_SERVER_PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${venv.VITE_SERVER_PORT}`)
})