import { Router } from "express";
import {login, register, information} from '../controllers/authController.js'
import {validateBody} from '../middleware/validation.js'
import { loginSchema, registerSchema } from "../controllers/models/auth.js";
import { authenticateToken } from "../middleware/authenticateToken.js";


const router = Router()

router.post('/register', validateBody(registerSchema), register)

router.post('/login', validateBody(loginSchema), login)

router.get("/information", authenticateToken, information)

export default router