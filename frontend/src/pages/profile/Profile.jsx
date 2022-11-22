import "./profile.scss";
import Update from "../../components/update/Update";
import Posts from "../../components/posts/Posts";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileImg from "../../img/avatarP.webp";
import ProfileCover from "../../img/logo.png";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [user, setUser] = useState([]);
  const [loggedInUser, setloggedInUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const getUser = async () => {
    setIsLoading((value) => !value);
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (userId) {
      let result = await makeRequest.get(`/users/find/${userId}`, {
        headers: { Authorization: `Bearer ${loggedInUser.token}` },
      });
      setUser(result.data[0]);
    }

    let rlesult = await makeRequest.get(`/users/find/${loggedInUser.userId}`, {
      headers: { Authorization: `Bearer ${loggedInUser.token}` },
    });

    setloggedInUser(rlesult.data[0]);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img
              src={
                user.profilePicture
                  ? "/upload/" + user.coverPicture
                  : ProfileCover
              }
              alt=""
              className="cover"
            />

            <img
              src={
                user.profilePicture
                  ? "/upload/" + user.profilePicture
                  : ProfileImg
              }
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="name">
                <span>{user.username}</span>

                {user?.id === loggedInUser?.id && (
                  <button onClick={() => setOpenUpdate(true)}>Modifier</button>
                )}
              </div>
            </div>

            {/*   {userId && <Posts userId={userId} />} */}
            {userId && <Posts userId={user.id} />}
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={user} />}
    </div>
  );
};

export default Profile;
