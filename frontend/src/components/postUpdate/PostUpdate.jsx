import "./postUpdate.scss";
import { useState /* , useContext  */} from "react";
import { makeRequest } from "../../axios";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
//import { AuthContext } from "../../context/authContext";

const PostUpdate = ({setUpdateOpen, post}) => {
  console.log(post)
 
   const [img, setImg] = useState(); 
   const [file, setFile] = useState(); 
  
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
        queryClient.invalidateQueries(["post"]);
      },
    }
  );
  console.log(post);
  const handleClick = async (e) => {
    e.preventDefault();
     /*  let imgUrl= "";
    if (file) imgUrl = await upload();
    mutation.mutate({ 
      ...texts, img: imgUrl 
    });   */
     let imgUrl;
  
    imgUrl = file ? await upload(img) : post.img;
    mutation.mutate({ 
      id:post.id,
      ...texts,
      img: imgUrl,
     
    }); 

    setUpdateOpen(false);
     setImg(null);
     setFile(null);
    /*  setId(post.id); */
    
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
       <button  /* {...isLoading ? "loading" :data.includes(post.userId)} */ onClick={handleClick}>Mettre à jour</button> 
     
      <button onClick={() => setUpdateOpen(false)}>x</button>
      
    </div>
     
    
  );
};

export default PostUpdate;

































































/* export default function PostUpdate({ setOpenUpdate, post }) {
const [file, setFile] = useState(null);
const [desc, setDesc] = useState("");
 

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
    setDesc((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (post) => {
      return makeRequest.put("/posts", post);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["post"]);
      },
    }
  );
  console.log(post);
  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc,img: imgUrl });
    setOpenUpdate(false);
    setDesc("");
    setFile(null);
    
  };
  return (
    <div className="postUpdate">
      <div className="wrapper">
        <form>
          <div className="files">
          <div className="imgContainer">
           <img className="file"src={URL.createObjectURL(file)}  alt=""  
              />  
              </div>
          <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>desc</label>
          <input
            type="text"
            value={desc}
            name="desc"
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
 */