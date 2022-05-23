/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";
import Login from "@components/ConnectPage/Login";
import Register from "@components/ConnectPage/Register";

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
  /* register -------------------------------------------------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin) {
      loginUser({ ...login });
    } else {
      console.log("register");
    }
  };

  /* lifecycle ------------------------------------------------------------- */
  let { loginUser, username } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  /* display --------------------------------------------------------------- */
  return (
    <div id="connect">
      <div id="connect__container">
        <div className="connect__description">
          <h1 className="wh-background">Dungeons & Dragons</h1>
          <h3 className="wh-background">A free text & chat based multiplayer RPG.</h3>
        </div>
        <div className="connect__input">
          {origin ? (
            <Login values={login} handleChange={handleChange} handleSubmit={handleSubmit} />
          ) : (
            <Register values={register} handleChange={handleChange} handleSubmit={handleSubmit} />
          )}
          <div id="connect__button">
            <button onClick={handleSubmit} className="btn-primary">
              {origin ? "LOGIN" : "REGISTER"}
            </button>
            <span>
              {origin ? "not registered yet?" : "already a member?"}{" "}
              {origin ? (
                <a href="#" onClick={handleOrigin}>
                  sign up
                </a>
              ) : (
                <a href="#" onClick={handleOrigin}>
                  sign in
                </a>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
