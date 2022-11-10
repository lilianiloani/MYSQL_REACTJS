import "./profile.scss";
import Update from "../../components/update/Update";
import Posts from "../../components/posts/Posts";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import {  useContext,  useState } from "react";
import { AuthContext } from "../../context/authContext";
import ProfileImg from "../../img/avatarP.webp";
import ProfileCover from "../../img/logo.png"; 

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);

  const { currentUser} = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
              <img
              src={data.profilePicture ? "/upload/" + data.coverPicture : ProfileCover}
              alt=""
              className="cover"
            />   
             
                <img
              src={data.profilePicture ? "/upload/" + data.profilePicture: ProfileImg}
              alt=""
              className="profilePic"
            />    
          
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="name">
              
                <span>{data.username}</span>

                {userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Modifier</button>
                ) : (
                  ""
                )}
              </div>
            </div>

            <Posts userId={userId} /> 
        {/*     <Post userId={userId}/> */}
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
