import "./posts.scss";
import Post from "../../components/post/Post";
import { makeRequest } from "../../axios";
import { useEffect, useState } from "react";

export default function Posts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPosts = async () => {
    setIsLoading((value) => !value);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;

   /*  let result = await makeRequest.get(`/posts/${userId}`, {headers: { Authorization: `Bearer ${token}` },
    }); */
    let result = await makeRequest.get(`/posts/${userId}`, {headers: { Authorization: `Bearer ${token}` },
  });

    setPosts([...result.data]);
    setIsLoading((value) => !value);
  };

  const handlePostDelete = async (post_id, user_id) => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    await makeRequest.delete(`/posts/${post_id}/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await getPosts();
    document.location.reload();
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="posts">
      {isLoading
        ? "loading"
        : posts.map((post) => (
            <Post
              post={post}
              handlePostDelete={handlePostDelete}
              key={post.id}
            />
          ))}
    </div>
  );
}
