import "./login.scss";
import Logo from "../../img/logoedit.png";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

export default function Login() {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Bonjour collègues!</h1>
          <img src={Logo} alt="" />

          <span>Vous n'avez pas de compte?</span>
          <Link to="/register">
            <button>S'inscrire</button>
          </Link>
        </div>
        <div className="right">
          <h1>CONNEXION</h1>

          <form>
            <input
              type="text"
              placeholder="Pseudo"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Mot de Passe"
              name="password"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleLogin}> Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
}
