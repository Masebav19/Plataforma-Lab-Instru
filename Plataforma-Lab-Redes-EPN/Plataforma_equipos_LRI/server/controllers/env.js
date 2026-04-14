import dotenv from 'dotenv'

dotenv.config();

const env =  function(){
    const env = {
        VITE_SERVER_PORT : process.env.VITE_SERVER_PORT
    }
    return env
}

export default env
