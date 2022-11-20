
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

 export const AuthContextProvider = ({ children }) => {
  
   const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8000/api/auth/login", inputs, {
      withCredentials: true,
    });
    console.log("Logged in Response :>>>>>>>>>", res);
    const user = await axios.get(`http://localhost:8000/api/users/find/${res.data.userId}`, {
      withCredentials: true,
      headers:{
        Authorization: `Bearer ${res.data.token}`
      }
    });
    console.log("User :>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", user)
     setCurrentUser(res.data) 
  };

   useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]); 

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
}; 


