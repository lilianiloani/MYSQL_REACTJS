import { db } from "../connect.js";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, username, profilePicture FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
    `;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const q =
    "INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
  const values = [
    req.body.desc,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    req.user.id,
    req.params.postId,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Le commentaire a été créé.");
  });
};

export const deleteComment = (req, res) => {
  let comment_id = req.params.id;
  let query = "SELECT * FROM comments WHERE `id` = ?";

  db.query(query, [comment_id], (error, result) => {
    if (error) return result.status(404).json("Post not found");

    //let comment = result[0];

    let userId = req.params.user_id;
   
    let user = "SELECT * FROM users WHERE `id` = ?";
    db.query(user, [userId], (error, result) => {
      if (error) return result.status(404).json("user not found");
      
    });
      const q = "DELETE FROM comments WHERE `id`=?";
      db.query(q, [comment_id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Post has been deleted.");
      });
    
  
    });
  /* const commentId = req.params.id;

  const q = "DELETE FROM comments WHERE `id`=?";

  db.query(q, [commentId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows > 0)
      return res.status(200).json("comment has been deleted.");
    return res.status(403).json("You can delete only your comment");
  }); */
};
