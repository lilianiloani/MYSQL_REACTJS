import "./navbar.scss";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
/* import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'; */

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import Logo from "../../img/logoedit.png";
import ProfileImg from "../../img/avatarP.webp"
import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const logout = () => {
    localStorage.clear();
    window.location = "/Register";
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={Logo} alt="" />
        </Link>
        <div className="user">
          <Link to={`/profile/${currentUser.id}`}>
            <img src={currentUser.profilePicture ? "/upload/" + currentUser.profilePicture : ProfileImg} alt="" />
          </Link>
        </div>

        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
      </div>
      <div className="right">
        <button onClick={logout}>Log Out</button>
      </div>
    </div>
  );
};

export default Navbar;
