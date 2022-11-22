import "./postUpdate.scss";
import { useState } from "react";
import { makeRequest } from "../../axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const PostUpdate = ({ setUpdateOpen, post,}) => {
  const [img, setImg] = useState();
  const [texts, setTexts] = useState(post?.desc);

  const upload = async (file) => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("desc", texts);
      try {
        await makeRequest.put(`/posts/${post.id}/${post.userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        document.location.reload();
      } catch (err) {
        console.log(err);
      }
    } catch (err) {}
  };

  const handleChange = (e) => {
    setTexts(e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (img) await upload(img);
    setTexts("");
    setImg(null);

    setUpdateOpen(false);
  };
  return (
    <div className="form">
      <h1>Mettre à jour votre post</h1>
      <form>
        <div className="files">
          <label htmlFor="img">
            <span>Media</span>
            <div className="imgContainer">
              <img
                src={img ? URL.createObjectURL(img) : "./upload/" + post.img}
                alt=""
              />
              <CloudUploadIcon className="icon" />
            </div>
          </label>
          <input
            type="file"
            id="img"
            style={{ display: "none" }}
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>
        <label>desc</label>
        <textarea
          rows={5}
          type="text"
          value={texts}
          name="desc"
          onChange={handleChange}
        />
      </form>
      <button onClick={handleClick}>Mettre à jour</button>

      <button onClick={() => setUpdateOpen(false)}>x</button>
    </div>
  );
};

export default PostUpdate;
