import dotenv from 'dotenv'

dotenv.config()

const emailSchema = {
    To: process.env.PRIMARY_EMAIL_TO,
    from: process.env.PRIMARY_EMAIL_FROM,
    password: process.env.EMAIL_PASSWORD,
    asunto: '',
    html: ''
}

export  {emailSchema}