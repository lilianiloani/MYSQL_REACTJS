import "./update.scss";
import { useState } from "react";
import { makeRequest } from "../../axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function Update({ setOpenUpdate, user }) {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email,
    username: user.username,
  });
  const upload = async (file, pfile) => {
    console.log("Here :>>>>>>>>>>>>>>>>", file);
    console.log("pFile here :>>>>>>>>>", pfile);

    const token = JSON.parse(localStorage.getItem("user")).token;
    try {
      const formData = new FormData();
      formData.append("cover", file);
      formData.append("profile", pfile);
      formData.append("email", texts.email);
      formData.append("username", texts.username); 

      await makeRequest.put("/users", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      document.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };


  const handleClick = async (e) => {
    e.preventDefault();
    
    (cover || profile) && (await upload(cover, profile));

    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Mettre à jour votre profil</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.coverPicture
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />

            <label htmlFor="profile">
              <span>Image de profil</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/upload/" + user.profilePicture
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>

          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
             onChange={handleChange} 
        
          />
          <label>Pseudo</label>
          <input
            type="text"
            value={texts.username}
            name="username"
            onChange={handleChange} 
          />
          <button onClick={handleClick}>Mettre à jour</button>
        </form>
        <button onClick={() => setOpenUpdate(false)}>x</button>
        Fermer
      </div>
    </div>
  );
}
