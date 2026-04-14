import z from 'zod'

const deviceLetSchema = z.object({
    Nombre: z.string({
        invalid_type_error: 'Nombre debe ser un string',
        required_error: 'Se debe colocar el nombre del responsable'
    }),
    email: z.string().email({
        message: 'Correo inválido'
    }).endsWith('@epn.edu.ec',{
        message: 'Debe ser correo institucional'
    }),
    Modelo: z.string({
        required_error: 'Debe seleccionar el modelo'
    }),
    Direccion_IP: z.string({
        required_error: 'Debe colocar la direccion IP o en su defecto Ninguno'
    }),
    ModulosExpansion: z.string({
        required_error: 'Debe colocar si tiene módulo de expansión o en su defecto Ninguno'
    }).default('Ninguno')
})

const deviceReturnedSchema = z.object({
   email: z.string().email({
    required_error: 'Debe colocar el emial'
   }).endsWith('@epn.edu.ec',{
    message: 'Debe colocar el correo institucional'
   }),
   Modelo: z.string({
    required_error: 'Debe colocar el modelo a devolver'
   }),
   Observacion: z.string({
    required_error: 'Colocar observaciones en caso de que haya, caso contrario colocar Ninguno'
   }),
   DocenteResponsable: z.string({
    required_error: 'Debe colocar el correo del docente responsable'
   }).email({
    message: 'Debe colocar el correo del docente responsable'
   }).endsWith('@epn.edu.ec',{
    message: 'Debe colocar el correo institucional' 
   }),
   Estado: z.string({
    required_error: 'Debe colocar el estado del Dispositivo a devolver'
   })
})

const newMaintenanceSchema = z.object({
    Nombre:z.string(),
    email: z.string().email({
        message: 'Debe ingresar un emaik' 
    }).endsWith('@epn.edu.ec',{
        message: 'Debe colocar el correo institucional' 
    }),
    Modelo: z.string({
        required_error: 'Debe colocal el modelo a realizar el mantenimiento'
    }),
    Especificaciones: z.string({
        required_error: 'Debe colocar la direción IP o en su defecto Ninguno'
    }),
    Actividades: z.string({
        required_error: 'Debe colocar las actividades a realizar'
    })
})

const endMaintenanceSchema = z.object({
    email: z.string().email({
        message: 'Colocar el correo'
    }).endsWith('@epn.edu.ec',{
    message: 'Debe colocar el correo institucional' 
   }),
    Modelo: z.string({
        required_error: 'Debe colocar el modelo'
    }), 
    Estado: z.string({
        required_error: 'Debe colocar el estado del dispositivo'
    })
})

function validateLetDevice(object){
    return deviceLetSchema.safeParse(object)
}

function validateReturnedDevice(object){
    return deviceReturnedSchema.safeParse(object)
}

function validateNewMaintance(object){
    return newMaintenanceSchema.safeParse(object)
}
function validateEndMaintance(object){
    return endMaintenanceSchema.safeParse(object)
}

export {validateLetDevice,validateReturnedDevice,validateNewMaintance,validateEndMaintance} 