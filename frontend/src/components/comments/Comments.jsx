import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import ProfileImg from "../../img/avatarP.webp";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const Comments = ({postId}) => {
  
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
 
  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then 
  ((res) => {
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
    (id) => {
      return makeRequest.delete("/comments/" + id);
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
  
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePicture ? "/upload/" + currentUser.profilePicture: ProfileImg} alt="" />
      
        <input
         type="text"
          placeholder="Écrire un commentaire"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
           />
        <button onClick={handleClick}>Envoyer</button>
      </div>

      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment) => (
            <div className="comment">
              <img src={comment.profilePicture ?"/upload/" + comment.profilePicture : ProfileImg} alt="" />
              <div className="info">
                <span>{comment.username}</span>
    
                <p>{comment.desc}</p>
              </div>
            
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
              <span className="item">
              {comment.userId === currentUser.id && (
            <DeleteOutlineOutlinedIcon onClick={handleDelete}/>
            )} 
            </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;


