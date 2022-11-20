import dotenv from "dotenv";
dotenv.config();
import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getSecretKey } from "../constants/keys.js";

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("L'utilisateur existe déjà!");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (`username`,`email`,`password`) VALUE (?)";

    const values = [req.body.username, req.body.email, hashedPassword];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("L'utilisateur a été créé.");
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(404).json("Utilisateur non trouvé!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Mot de passe ou nom d'utilisateur erroné!");

    const maxAge = 1 * (24 * 60 * 60 * 1000);
    let user = data[0];
    delete user.password;

    const token = jwt.sign({ user: user }, getSecretKey(), {
      expiresIn: maxAge,
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
    });
    res.status(200).json({ token, userId: user.id });
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("L'utilisateur a été déconnecté.");
};
