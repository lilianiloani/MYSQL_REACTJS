import { db } from "../connect.js";
import moment from "moment";
import { v4 } from "uuid";
import path from "path";
import fs from "fs";

export const getPosts = (req, res) => {
  const userId = req.user.id;
  const q =
    userId === undefined
      ? `SELECT p.*, u.id AS userId, username, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId)  WHERE p.userId = ? ORDER BY p.createdAt DESC`
      : `SELECT p.*, u.id AS userId, username, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId) ORDER BY p.createdAt DESC`;
  const values = userId !== undefined && [userId];
  db.query(q, userId && values, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const addPost = (req, res) => {
  let file = req.file;

  const fileName = `${v4()}.${file.originalname.split(".").splice(-1)[0]}`;

  const url = path.normalize(
    `${path.resolve(path.dirname(""))}../../frontend/public/upload/${fileName}`
  );

  fs.writeFileSync(url, file.buffer, { flag: "w" });

  const q =
    "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
  const values = [
    req.body.desc,
    fileName,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    req.user.id,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json("Post has been created.");
  });
};

export const deletePost = async (req, res) => {
  let post_id = req.params.id;
  let query = "SELECT * FROM posts WHERE `id` = ?";

  db.query(query, [post_id], (error, result)=>{
    if(error) return result.status(404).json('Post not found');
    let post = result[0];

    let userId = req.params.user_id;
    let isAdmin = 0
    let user = "SELECT * FROM users WHERE `id` = ?";
    db.query(user, [userId], (error,result)=>{
      if(error) return result.status(404).json('user not found'); 
      isAdmin = result[0].isAdmin;
      console.log("user:>> ", result)
    });
    
    if(req.params.user_id == post.userId || isAdmin === 1){

      const q = "DELETE FROM posts WHERE `id`=?";  
      db.query(q, [post_id], (err, data) => { 
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Post has been deleted.");
      
      });
    }
    else{
      return res.status(401).json("You do not have access to this resource.")
    }
  });

};

export const updatePost = (req, res) => {

  let post_id = req.params.id;
  let query = "SELECT * FROM posts WHERE `id` = ?";

  db.query(query, [post_id], (error, result)=>{
    if(error) return result.status(404).json('Post not found');
    let post = result[0];

    let userId = req.params.user_id;
    let isAdmin = 0
    let user = "SELECT * FROM users WHERE `id` = ?";
    db.query(user, [userId], (error,result)=>{
      if(error) return result.status(404).json('user not found'); 
      isAdmin = result[0].isAdmin;
      console.log("user:>> ", result)
    });
    
    if(req.params.user_id == post.userId || req.user.isAdmin === 1){
      let file = req.file;

      const fileName = `${v4()}.${file.originalname.split(".").splice(-1)[0]}`;

      const url = path.normalize(
        `${path.resolve(path.dirname(""))}../../frontend/public/upload/${fileName}`
      );

      fs.writeFileSync(url, file.buffer, { flag: "w" });

      const q = "UPDATE posts SET `desc`=?,`img`=? WHERE `id` =?";
      db.query(q, [req.body.desc, fileName, req.params.id], (err, data) => {
        if (err) res.status(500).json(err);
        return res.status(200).json(data);
      });
    }
    else{
      return res.status(401).json("You do not have access to this resource.")
    }
  });

};
