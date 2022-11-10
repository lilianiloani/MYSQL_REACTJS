


 import "./register.scss";
import Logo from "../../img/logoedit.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router";
import axios from "axios";

export default function Register() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    name: "",
    surname: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/auth/register", inputs);
      return navigate("/login");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Bonjour collègues!</h1>
          <img src={Logo} alt="" />
          <span>Avez-vous un compte?</span>
          <Link to="/login">
            <button>Se connecter</button>
          </Link>
        </div>
        <div className="right">
          <h1>INSCRIPTION</h1>
          <form>
       
            <input
              type="text"
              placeholder="Pseudo"
              name="username"
              onChange={handleChange}
            />
          
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
          
            <input
              type="password"
              placeholder="Mot de Passe"
              name="password"
              onChange={handleChange}
            />
            
            <input
              type="password"
              placeholder="Confirmer Mot de Passe"
              name="confirmPassword"
              onChange={handleChange}
            />
            {err && err}
            <button onClick ={handleClick}> S'inscrire</button>
          </form>
        </div>
      </div>
    </div>
  );
}
