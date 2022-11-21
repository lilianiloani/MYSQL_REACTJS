import express from "express";
import { getLikes, addLike, deleteLike } from "../controllers/like.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = express.Router()

router.get("/:id", auth, getLikes)
router.put("/", auth, addLike)
router.delete("/:postId",auth, deleteLike)


export default router