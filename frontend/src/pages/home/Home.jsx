import "./home.scss";
import Share from "../../components/share/Share";
import Posts from "../../components/posts/Posts";

export default function Home() {
  return (
    <div className="home">
   <Share/>
   <Posts/>
    </div>
  )
}
