import axios from "axios";
import jwt_decode from "jwt-decode";

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);

  /* life cycle methods ---------------------------------------------------- */
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null
  );
  let [username, setUsername] = useState(() =>
    localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")).username : null
  );
  let [userId, setUserId] = useState(() =>
    localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")).user_id : null
  );

  useEffect(() => {
    let timer = 3 * 60 * 1000;

    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, timer);

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  /* login method ---------------------------------------------------------- */
  let loginUser = async (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;
    /* fetch token --------------------------------------------------------- */
    let res = await axios({
      url: "http://127.0.0.1:8000/token/",
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      data: { username, password },
    });
    /* check response status ----------------------------------------------- */
    if (res.status === 200) {
      /* if ok ------------------------------------------------------------- */
      let resTokens = res.data;
      let resUsername = jwt_decode(res.data.access).username;
      let resId = jwt_decode(res.data.access).user_id;

      setAuthTokens(resTokens);
      setUsername(resUsername);
      setUserId(resId);

      localStorage.setItem("authTokens", JSON.stringify(resTokens));

      navigate("/");
    } else {
      /* if error ---------------------------------------------------------- */
      alert("Wrong input");
    }
  };

  /* logout method --------------------------------------------------------- */
  let logoutUser = () => {
    setAuthTokens(null);
    setUsername(null);
    localStorage.removeItem("authTokens");
  };

  /* refresh token --------------------------------------------------------- */
  let updateToken = async () => {
    console.log("prout");
    let res = await axios({
      url: "http://127.0.0.1:8000/token/refresh/",
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      data: { refresh: authTokens.refresh },
    });

    if (res.status === 200) {
      let resTokens = res.data;
      let resUsername = jwt_decode(res.data.access).username;
      let resId = jwt_decode(res.data.access).user_id;

      setAuthTokens(resTokens);
      setUsername(resUsername);
      setUserId(resId);

      localStorage.setItem("authTokens", JSON.stringify(resTokens));
    } else {
      logoutUser();
    }
  };

  /* data ------------------------------------------------------------------ */
  let contextData = {
    username,
    userId,
    authTokens,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
