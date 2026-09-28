import emailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config()
async function Send_email(msg="",asunto="",user="",pass="",dest="",attachments=[]){
    const email_data ={
        user: user,
        password: pass,
        dest: dest,
    }
    
    
    let transporter = emailer.createTransport({
        service:  process.env.SERVICE,
        auth:{
            user: email_data.user,
            pass:email_data.password,   
        },
        debug:true,
        logger:true,
    });
    
    let mailoptions ={
        from: email_data.user,
        to: email_data.dest,
        subject: asunto,
        html: msg,
        attachments
    };
    let result = 'Error'
    transporter.sendMail(mailoptions,(err,info)=>{
        if (err){
            result = 'Error'
        }else{
            result = 'Enviado'
        }
    })
    return result
}

export { Send_email }