 
 import jwt from "jsonwebtoken";
 import dotenv  from "dotenv"
 import { getSecretKey } from "../constants/keys.js";
 dotenv.config()
 
 
 export const auth = async (req, res, next) =>{
     let token = req.get("authorization");
     if (!token) {
       return {
         success: false,
         error: false,
         stack: null,
         data: null,
       };
     }
 
     token = token.slice(7);
     
     try {
       let decoded = await jwt.verify(token, getSecretKey());
      
       req.user = decoded.user;
       next();
     } catch (error) {
     
       return {
         success: false,
         message: "Access denied: Unauthorized access.",
         stack: error,
         error: true,
         data: null,
       }
     }
   }