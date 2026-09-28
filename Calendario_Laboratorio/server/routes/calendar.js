import { Router } from "express"
import Calendar from "../Controllers/calendar.js"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

export const router = Router()


router.get('/getDaysbyMonth/:month/:year', Calendar.getDaysbyMonth)
router.get('/getDaysbyWeek/:month/:year/:date/:laboratorio', Calendar.getDaysbyWeek)


router.post('/LogIn',Calendar.LogIn)
router.post('/Logout',Calendar.Logout)
router.post('/SignUp', Calendar.SignUp)
router.delete('/DeleteUser',Calendar.DeleteUser)

router.post('/NewSession', Calendar.NewSession)
router.delete('/DeleteSession', Calendar.DeleteSession)

router.get('/regDevice/:Id/:laboratorio', Calendar.RegDevice)
router.post('/OpenTicket', Calendar.OpenTicket)
router.post('/CloseTicket',upload.single('image'), Calendar.CloseTicket)
router.get('/GetNewTickets', Calendar.ReadNewTickets)
router.get('/GetClosedTickets', Calendar.ReadClosedTickets)
router.get('/GetTicketImage/:id_ticket', Calendar.GetImageTicket)