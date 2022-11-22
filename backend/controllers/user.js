import { db } from "../connect.js";
import {v4} from "uuid";
import path from "path";
import fs from "fs";

export const getUser = (req, res) => {
  let user = req.user;

  let userId = req.params.userId ?? user.id;

  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    delete data.password;
    return res.json(data);
  });
};

export const updateUser = (req, res) => {
  console.log("File :>>>>>>>>>>>>>>>>>>>>>>>", req);
   let cover = req.files['cover'][0];
  let profile = req.files['profile'][0]; 
  
  const coverFileName = `${v4()}.${
    cover.originalname.split(".").splice(-1)[0]
  }`;

  const profileFileName = `${v4()}.${
    profile.originalname.split(".").splice(-1)[0]
  }`;

  const coverUrl = path.normalize(`${path.resolve(path.dirname(''))}../../frontend/public/upload/${coverFileName}`);
  const profileUrl = path.normalize(`${path.resolve(path.dirname(''))}../../frontend/public/upload/${profileFileName}`);

  fs.writeFileSync(
    coverUrl,
    cover.buffer,
    { flag: "w" }
  );

  fs.writeFileSync(
    profileUrl,
    profile.buffer,
    { flag: "w" }
  );

  const q =
    "UPDATE users SET `username`=?,`email`=?, `profilePicture`=?,`coverPicture`=? WHERE id=? ";

  db.query(
    q,
    [
      req.body.username,
      req.body.email,
      profileFileName,
      coverFileName,
      req.user.id,
    ],
    (err, data) => {
      if (err) res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Updated!");
      return res.status(403).json("You can update only your profile!");
    }
  ); 
};



/* export const updateUser = (req, res) => {
  let cover = req.files['cover'] && req.files['cover'][0];
  let profile = req.files['profile'] && req.files['profile'][0];

  const coverFileName = cover && `${v4()}.${
    cover.originalname.split(".").splice(-1)[0]
  }`;

  const profileFileName = profile && `${v4()}.${
    profile.originalname.split(".").splice(-1)[0]
  }`;

  const coverUrl = coverFileName && path.normalize(`${path.resolve(path.dirname(''))}../../frontend/public/upload/${coverFileName}`);
  const profileUrl = profileFileName && path.normalize(`${path.resolve(path.dirname(''))}../../frontend/public/upload/${profileFileName}`);

  //console.log("Uploaded Path :>>>>>>>>>>>>>>>>>>>>", url);

  cover && fs.writeFileSync(
    coverUrl,
    cover.buffer,
    { flag: "w" }
  );

  profile && fs.writeFileSync(
    profileUrl,
    profile.buffer,
    { flag: "w" }
  );

  const q =
    "UPDATE users SET `email`=?,`username`=?, `profilePicture`=?,`coverPicture`=? WHERE id=? ";

    const query = "SELECT * FROM users WHERE id=?";
    db.query(query, [req.params.user_id, (error, result)=>{
      if(error) console.log("Error :>>>>>>>>>>>>", error)
      db.query(
        q,
        [
          req.body.email ?? result.email,
          req.body.username ?? result.username,
          profileFileName ?? result.profilePicture,
          coverFileName ?? result.coverPicture,
        ],
        (err, data) => {
          if (err) res.status(500).json(err);
          if (data.affectedRows > 0) return res.json("Updated!");
          return res.status(403).json("You can update only your profile!");
        }
      );

    }])

  
};
 */