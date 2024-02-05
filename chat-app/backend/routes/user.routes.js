import { Router } from "express";
import {
    loginUser,
    registerUser,

} from "../controllers/user.controller.js";

const router = Router()
router.route("/register").post(registerUser)
router.route("/getdata").get((req,res)=>{
    res.json("hello")
})
router.route("/login").post(loginUser)



export default router