/* global ------------------------------------------------------------------ */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";
import Login from "./ConnectPage/Login";
import Register from "./ConnectPage/Register";

const ConnectPage = () => {
  /* form handling --------------------------------------------------------- */
  const [origin, setOrigin] = useState(true);
  const [login, setLogin] = useState({ username: "", password: "" });
  const [register, setRegister] = useState({
    username: "",
    password: "",
    passwordConfirmation: "",
    email: "",
    rgpd: "",
  });

  const handleChange = (e) => {
    if (e.target.parentElement.name === "connect") {
      setLogin((oldState) => ({ ...oldState, [e.target.name]: e.target.value }));
    } else if (e.target.parentElement.name === "register") {
      setRegister((oldState) => ({
        ...oldState,
        [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
    }
  };

  const handleOrigin = (e) => {
    e.preventDefault();
    setOrigin((oldState) => !oldState);
  };

  /* tests ----------------------------------------------------------------- */

  // useEffect(() => {
  //   console.log(register);
  // }, [register]);

  /* lifecycle ------------------------------------------------------------- */
  let { username } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      navigate("/");
    }
  }, []);

  /* display --------------------------------------------------------------- */
  return (
    <div id="connect">
      <div id="connect__container">
        <div className="connect__description">
          <h1>Dungeons & Dragons</h1>
          <h4>A free text & chat based multiplayer RPG.</h4>
        </div>
        <div className="connect__input">
          {origin ? (
            <Login values={login} handleChange={handleChange} />
          ) : (
            <Register values={register} handleChange={handleChange} />
          )}
          <div id="connect__button">
            <button className="connect__button">{origin ? "LOGIN" : "REGISTER"}</button>
            <span className="connect__button__legend">
              {origin ? "not registered yet?" : "already a member?"}{" "}
              {origin ? <a onClick={handleOrigin}>sign up</a> : <a onClick={handleOrigin}>sign in</a>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
