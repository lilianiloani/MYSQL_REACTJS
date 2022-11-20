import "./navbar.scss";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import Logo from "../../img/logoedit.png";
import ProfileImg from "../../img/avatarP.webp";
import { makeRequest } from "../../axios";
import { useState } from "react";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const [user, setUser] = useState({});

  const getUser = async () => {
    let token = JSON.parse(localStorage.getItem("user")).token;
    let query = await makeRequest("/users/find/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(query.data[0]);
  };

  useEffect(() => {
    getUser();
  }, []);

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
          <Link to={`/profile/${user.id}`}>
            <img
              src={
                user?.profilePicture
                  ? "/upload/" + user?.profilePicture
                  : ProfileImg
              }
              alt=""
            />
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
