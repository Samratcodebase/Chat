import express from "express"
import { Login } from "../Controllers/Auth.controller.js"


const router= express.Router()

router.get("/login", Login)



export default router;