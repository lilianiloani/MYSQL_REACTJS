import express from "express";
import multer from "multer";
import { getPosts, addPost, deletePost,updatePost } from "../controllers/post.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = express.Router();
const upload = multer();

router.get("/:userId?", auth, getPosts);
router.post("/", auth, upload.single("file"), addPost);
router.delete("/:id/:user_id",auth,  deletePost);
router.put("/:id/:user_id", auth, upload.single("file"),updatePost);

export default router;