import express from "express";
import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/comment.js";
import { auth } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/", getComments);
router.post("/",auth, addComment);
router.delete("/:id",auth, deleteComment);

export default router;