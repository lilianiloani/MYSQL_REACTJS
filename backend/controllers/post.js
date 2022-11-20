import { db } from "../connect.js";
//import jwt from "jsonwebtoken";
import moment from "moment";
import {v4} from "uuid";
import path from "path";
import fs from "fs";

export const getPosts = (req, res) => {
 /* const userId = req.params.userId; */
 const userId = req.user.id;
 console.log("User ID :>>>>>>>>>>>>>>>>>>>>>", userId);

const q =
   userId === undefined 
 ? `SELECT p.*, u.id AS userId, username, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId)  WHERE p.userId = ? ORDER BY p.createdAt DESC`
 : `SELECT p.*, u.id AS userId, username, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId) ORDER BY p.createdAt DESC`
const values =
userId !== undefined && [userId]; 
db.query(q, userId && values,  (err, data) => {
  console.log("Error :>>>>>>>>>>>>>>>>", err);
if (err) return res.status(500).json(err);

return res.status(200).json(data);
});

};

export const addPost = (req, res) => {
let file = req.file;

  const fileName = `${v4()}.${
    file.originalname.split(".").splice(-1)[0]
  }`;

  const url = path.normalize(`${path.resolve(path.dirname(''))}../../frontend/public/upload/${fileName}`);

  fs.writeFileSync(
    url,
    file.buffer,
    { flag: "w" }
  );

  const q =
      "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      fileName,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.user.id,
    ];

    db.query(q, [values], (err,data ) => {
      if (err) return res.status(500).json(err);

      console.log('addedPost Here :>>>>>>>>>>>>', data)
      return res.status(200).json("Post has been created.");
    });
};

export const deletePost = (req, res) => {
  //Get the post by post id
  //check if req.params.postId
  //check if req.user.isAdmin is true

  //if(post.userId === req.params.userId || req.user.isAdmin === true);

  const q =
  
           /* "DELETE FROM posts WHERE `id`=? AND `userId` = ? AND `isAdmin` ===1";  
 */
           "DELETE FROM posts WHERE `id`=?";  
 
      db.query(q, [req.params.id], (err, data) => {  
      
   //db.query(q, [req.params.id, req.user.id,], (err, data) => {  
 
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
};



  export const updatePost = (req, res) => {
    let file = req.file;

  const fileName = `${v4()}.${
    file.originalname.split(".").splice(-1)[0]
  }`;

  const url = path.normalize(`${path.resolve(path.dirname(''))}../../frontend/public/upload/${fileName}`);

  fs.writeFileSync(
    url,
    file.buffer,
    { flag: "w" }
  );
        const q = "UPDATE posts SET `desc`=?,`img`=? WHERE `id` =?";
          db.query(q, [req.body.desc, fileName, req.params.id], (err, data) => {
            if (err) res.status(500).json(err);
            return res.status(200).json(data);
          });
      };