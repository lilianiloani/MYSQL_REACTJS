import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext, useEffect } from "react";
import moment from "moment";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import ProfileImg from "../../img/avatarP.webp";
import PostUpdate from "../../components/postUpdate/PostUpdate";

export default function Post({ post, handlePostDelete }) {
  const [commentOpen, setCommentOpen] = useState(false);
  //const [menuOpen, setMenuOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [likes, setLikes] = useState([]);
  const [user, setUser] = useState({});
  const { currentUser } = useContext(AuthContext);
  const [likesLoading, setLikesLoading] = useState(false);

  const getLikes = async () => {
    setLikesLoading((value) => !value);
    try {
      let queryLikes = await makeRequest.get(`/likes/${post.id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setLikes(queryLikes.data);
      setLikesLoading((value) => !value);
    } catch (e) {}
  };

  const handleLike = async () => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    await makeRequest.put(
      `/likes`,
      { postId: post.id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await getLikes();
  };

  useEffect(() => {
    getLikes();
  }, [post]);

  const handleLikeDelete = async () => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    await makeRequest.delete(`/likes/${post.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await getLikes();
  };

  const handleUpdate = () => {};

  const getUser = async () => {
    let userQuery = await makeRequest.get(`/users/find`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
    setUser(userQuery.data[0]);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={
                post.profilePicture
                  ? "/upload/" + post.profilePicture
                  : ProfileImg
              }
              alt=""
            />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.username}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>

          {(post.userId === user.id || user.isAdmin === 1) && (
            <button
              onClick={() => {
                handlePostDelete(post.id, post.userId);
              }}
            >
              Supprimer
            </button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./upload/" + post.img} alt="" />
        </div>

        <div className="info">
          <div className="item">
            {likesLoading ? (
              "loading..."
            ) : likes.includes(user.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLikeDelete}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {likes?.length} J'aime
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            commentaires
          </div>
          <div className="item" onClick={() => setUpdateOpen(true)}>
            {(post.userId === user.id || user.isAdmin === 1) && (
              <ModeEditOutlineOutlinedIcon />
            )}
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
      {updateOpen && (
        <PostUpdate
          setUpdateOpen={setUpdateOpen}
          post={post}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
