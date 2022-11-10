import "./postUpdate.scss";
import { useState } from "react";
import { makeRequest } from "../../axios";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const PostUpdate = ({setUpdateOpen, post}) => {
  console.log(post)
 
   const [img, setImg] = useState(); 
   const [texts, setTexts] = useState({
    desc: post.desc,
     
  }); 
 

  const upload = async (file) => {
    console.log(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();
  
  const mutation = useMutation(
    (post) => {
      console.log(post)
      return makeRequest.put("/posts/"+post.id, post); 
      
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  console.log(post);
  const handleClick = async (e) => {
    e.preventDefault();
   
     let imgUrl;
  
    imgUrl = img ? await upload(img) : post.img;
    mutation.mutate({ 
      id:post.id,
      ...texts,
      img: imgUrl,
     
    }); 

    setUpdateOpen(false);
     setImg(null);
     
    
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
                  src={
                    img
                      ? URL.createObjectURL(img)
                      : "./upload/" + post.img
                  }
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
            value={texts.desc}
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

































































