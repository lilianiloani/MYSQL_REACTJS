import "./home.scss";
import Share from "../../components/share/Share"
import Posts from "../../components/posts/Posts";
import {useEffect, useState,} from "react";
import { makeRequest } from "../../axios";

export default function Home() {
  const [submit, setSubmit] = useState(false)
  const [user, setUser] = useState([])
  const getUser = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const token = loggedInUser.token;
    let result = await makeRequest.get("/users/find/" , {headers:{Authorization:`Bearer ${token}`}});
    setUser(result.data);
  }

useEffect(() => {
  getUser();
}, [submit])
  return (
    <div className="home">
      
   <Share setSubmit={setSubmit} user={user[0]}/>
    <Posts /> 
    </div>
  )
}
