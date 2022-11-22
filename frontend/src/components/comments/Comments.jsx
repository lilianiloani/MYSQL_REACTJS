import { useEffect, useState,  useContext, } from "react";
import "./comments.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import ProfileImg from "../../img/avatarP.webp";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const [user, setUser] = useState({});
  const { currentUser } = useContext(AuthContext); 

  const getUser = async () => {
    //let token = JSON.parse(localStorage.getItem("user")).token;
    let query = await makeRequest("/users/find/", {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
    console.log("From comment :>>>>>>>>>>>>>>>>>>>", query.data[0]);
    setUser(query.data[0]);
  };

  useEffect(() => {
    getUser();
  }, [])

  const { isLoading,  data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/comments/" + postId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );
  const handleDelete = () => {
    deleteMutation.mutate(postId);
  }; 

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  /* const getComments = async () => {
    setIsLoading((value) => !value);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;

    let result = await makeRequest.get("/posts?userId=" + user, {
      headers: { Authorization: `Bearer ${token}` },
    });

    getComments([...result.data]);
    setIsLoading((value) => !value);
  };

  const handleDelete = async (post_id) => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    await makeRequest.delete(`/posts/${post_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await getComments();
    window.location.reload();
  };

  useEffect(() => {
    getComments();
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    setDesc("");
  };
 */

 /*  const getComments = async() =>{
    
    setLikesLoading(value=>!value);
    try{
      let queryLikes = await makeRequest.get(`/likes/${postId}`, {headers:{
        Authorization:`Bearer ${currentUser.token}`,
      }});
       setLikes(queryLikes.data); 
      setLikesLoading(value=>!value);
    }catch(e){
      console.log("Get like Error :>>>>", e);
    }
    
   } */

   
  /* const handleDelete = async () => {
    const token = JSON.parse(localStorage.getItem('user')).token;
    await makeRequest.delete(`/comments/${postId}`, {
      headers:{
         Authorization: `Bearer ${token}` 
      
      },
    });
    
    await getComments();
  }; */

  return (
    <div className="comments">
      <div className="write">
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
          placeholder="Écrire un commentaire"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Envoyer</button>
      </div>

       {isLoading
        ? "loading"
        : data.map((comment) => ( 
            <div className="comment">
              <img
                src={
                  comment?.profilePicture
                    ? "/upload/" + comment?.profilePicture
                    : ProfileImg
                }
                alt=""
              />
              <div className="info">
                <span>{comment?.username}</span>

                <p>{comment?.desc}</p>
              </div>

              <span className="date">
                {moment(comment?.createdAt).fromNow()}
              </span>
              <span className="item">
                {comment.userId === user.id && (
                  <DeleteOutlineOutlinedIcon onClick={handleDelete} />
                )}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
