/* gobal ------------------------------------------------------------------- */
import axios from "axios";
import jwt_decode from "jwt-decode";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* TODO -------------------------------------------------------------------- */
//// login method
//// refresh token
//// logout
// add authlib to use gmail & github

/* ------------------------------------------------------------------------- */
/* context                                                                   */
/* ------------------------------------------------------------------------- */

const AuthContext = createContext();

export default AuthContext;

/* ------------------------------------------------------------------------- */
/* provider                                                                  */
/* ------------------------------------------------------------------------- */

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
    if (loading) {
      updateToken();
    }

    let timer = 4 * 60 * 1000;

    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, timer);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [authTokens, loading]);

  /* login method ---------------------------------------------------------- */

  let loginUser = async (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;
    if (username && password) {
      await axios({
        url: "http://127.0.0.1:8000/token/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: { username, password },
      })
        .then((response) => {
          if (response.status === 200) {
            let resTokens = response.data;
            let resUsername = jwt_decode(response.data.access).username;
            let resId = jwt_decode(response.data.access).user_id;

            setAuthTokens(resTokens);
            setUsername(resUsername);
            setUserId(resId);

            localStorage.setItem("authTokens", JSON.stringify(resTokens));

            navigate("/");
          }
        })
        .catch((e) => {
          alert("Wrong input");
        });
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
    if (authTokens) {
      await axios({
        url: "http://127.0.0.1:8000/token/refresh/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: { refresh: authTokens?.refresh },
      })
        .then((response) => {
          if (response.status === 200) {
            let resTokens = response.data;
            let resUsername = jwt_decode(response.data.access).username;
            let resId = jwt_decode(response.data.access).user_id;

            setAuthTokens(resTokens);
            setUsername(resUsername);
            setUserId(resId);

            localStorage.setItem("authTokens", JSON.stringify(resTokens));
          }
        })
        .catch((e) => logoutUser());
    }

    if (loading) {
      setLoading(false);
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

  return <AuthContext.Provider value={contextData}>{loading ? null : children}</AuthContext.Provider>;
};
