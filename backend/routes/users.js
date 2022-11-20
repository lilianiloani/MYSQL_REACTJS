import express from "express";
import multer from "multer";
import { getUser , updateUser} from "../controllers/user.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = express.Router()
const upload = multer();


router.get("/find/:userId?",auth, getUser)
router.put("/",auth, upload.fields([{name:"cover",maxCount:1}, {name:"profile",maxCount:1}]), updateUser)


export default router