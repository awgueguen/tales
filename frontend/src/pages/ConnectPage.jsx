/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";
import Login from "@components/ConnectPage/Login";
import Register from "@components/ConnectPage/Register";

const ConnectPage = () => {
  /* template -------------------------------------------------------------- */

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const [register, setRegister] = useState({
    username: "",
    password: "",
    passwordConfirmation: "",
    email: "",
    rgpd: false,
  });

  /* form handling --------------------------------------------------------- */

  const [origin, setOrigin] = useState("login");
  const [errorState, setErrorState] = useState(false);
  const [formState, setFormState] = useState({
    login: false,
    register: false,
  });

  const [errMessage, setErrMessages] = useState({
    login: "",
    register: "",
  });

  const handleChange = (e) => {
    if (!errMessage.register.includes("password")) {
      setErrorState(false);
    }

    if (e.target.parentElement.name === "connect") {
      setLogin((oldState) => ({ ...oldState, [e.target.name]: e.target.value }));
    } else if (e.target.parentElement.name === "register" || e.target.name === "rgpd") {
      setRegister((oldState) => ({
        ...oldState,
        [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
    }
  };

  useEffect(() => {
    let newState = { ...formState };
    if (errMessage[origin]) {
      setFormState(() => ({ ...newState, [origin]: false }));
    } else {
      setFormState(() => ({ ...newState, [origin]: true }));
    }
    // eslint-disable-next-line
  }, [errMessage]);

  /* login ----------------------------------------------------------------- */

  useEffect(() => {
    if (origin !== "login") {
      return;
    }

    let newErrMessage = { ...errMessage };
    newErrMessage.login = "";

    if (Object.values(login).some((input) => input === "")) {
      newErrMessage.login = "You must fill all fields.";
    }

    setErrMessages(newErrMessage);
    // eslint-disable-next-line
  }, [login, origin]);

  /* register -------------------------------------------------------------- */

  const handleBlur = (e) => {
    let newErrMessage = { ...errMessage };

    if (register.password.length < 5) {
      newErrMessage.register = "Your password is too short (6 characters min).";
      setErrorState(true);
    } else if (register.password !== register.passwordConfirmation) {
      newErrMessage.register = "Your passwords do not match.";
      setErrorState(true);
    } else {
      newErrMessage.register = "You must fill all fields.";
      setErrorState(false);
    }
    setErrMessages(newErrMessage);
  };

  useEffect(() => {
    if (origin !== "register" || errMessage.register.includes("password")) {
      return;
    }

    let newErrMessage = { ...errMessage };
    newErrMessage.register = "";

    if (!register.rgpd) {
      newErrMessage.register = "To continue please accept our Terms of service.";
    }

    if (Object.values(register).some((input) => input === "")) {
      newErrMessage.register = "You must fill all fields.";
    }

    setErrMessages(newErrMessage);
    // eslint-disable-next-line
  }, [register, origin]);

  /* submit ---------------------------------------------------------------- */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin === "login" && formState.login) {
      loginUser({ ...login }).then((err) => {
        if (err) {
          let newErrMessage = { ...errMessage };
          newErrMessage.login = "Username or password does not matched.";
          setErrMessages(newErrMessage);

          setErrorState(true);
        }
      });
    } else if (origin === "register" && formState.register) {
      registerUser({ ...register }).then((err) => {
        if (Object.keys(err).length > 0) {
          let newErrMessage = { ...errMessage };
          let errMsg = [].concat.apply([], Object.values(err)).join(" ");
          newErrMessage.register = errMsg;
          setErrMessages(newErrMessage);

          setErrorState(true);
        }
      });
    } else {
      setErrorState(true);
    }
  };

  /* terms of service ------------------------------------------------------ */
  const handleModal = (e, modalName) => {
    e.preventDefault();

    const modal = document.querySelector(`.${modalName}-modal__container`);
    if (modal.hasAttribute("open")) {
      modal.close();
    } else {
      modal.showModal();
    }
  };

  /* lifecycle ------------------------------------------------------------- */

  let { loginUser, registerUser, username } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const request = axios.CancelToken.source();

    if (username) {
      navigate("/");
    }
    return request.cancel();
    // eslint-disable-next-line
  }, []);

  const handleOrigin = (e) => {
    e.preventDefault();
    setErrorState(false);
    setOrigin(e.target.name);
  };

  /* display --------------------------------------------------------------- */
  return (
    <div id="connect">
      <div id="connect__container">
        <div className="connect__description">
          <h1 className="wh-background">Tales</h1>
          <h3 className="wh-background">A free text & chat based multiplayer RPG.</h3>
        </div>
        <div className="connect__input">
          {origin === "login" ? (
            <Login
              values={login}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              errorState={errorState}
              errors={errMessage.login}
            />
          ) : (
            <Register
              values={register}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleBlur={handleBlur}
              handleModal={handleModal}
              errorState={errorState}
              errors={errMessage.register}
            />
          )}
          <div id="connect__button">
            {origin === "login" ? (
              <button onClick={handleSubmit} className={formState.login ? "btn-primary" : "btn-primary unactive"}>
                LOGIN
              </button>
            ) : (
              <button onClick={handleSubmit} className={formState.register ? "btn-primary" : "btn-primary unactive"}>
                REGISTER
              </button>
            )}

            <span>
              {origin === "login" ? "not registered yet?" : "already a member?"}{" "}
              {origin === "login" ? (
                <a name="register" href="/" onClick={handleOrigin}>
                  sign up
                </a>
              ) : (
                <a name="login" href="/" onClick={handleOrigin}>
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
