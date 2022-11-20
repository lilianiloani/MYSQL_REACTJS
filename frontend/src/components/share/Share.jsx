import "./share.scss";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import {useState } from "react";
import { makeRequest } from "../../axios";
import ProfileImg from "../../img/avatarP.webp";

const Share = ({ user, setSubmit }) => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const upload = async () => {
    console.log("File", file);
    const token = JSON.parse(localStorage.getItem("user")).token;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("desc", desc);

      await makeRequest.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubmit((value) => !value);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    if (file) await upload();
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={
                user?.profilePicture
                  ? "/upload/" + user?.profilePicture
                  : ProfileImg
              }
              alt=""
            />

            <input
              type="text"
              placeholder={`Quoi de neuf ${user?.username}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" src={URL.createObjectURL(file)} alt="" />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <PermMediaOutlinedIcon />
                <span>Media</span>
              </div>
            </label>
          </div>
          <div className="right">
            <button onClick={handleClick}>Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
