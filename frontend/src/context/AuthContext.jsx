/**
 * * CLEAN CODE
 */
/* gobal ------------------------------------------------------------------- */
import jwt_decode from "jwt-decode";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* Services ------------------------------------------------------------- */
import { loginUser as loginService, registerUser as registerService, refreshToken as refreshService } from "@services/auth/auth.services.js"; 
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
  let [profilPic, setProfilPic] = useState(() =>
    localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")).profile_pic : null
  );
  // let [nickname, setNickname] = useState(() =>
  //   localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")).nickname : null
  // );

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

  let registerUser = async ({ username, password, email, rgpd }) => {
    let error = {};
    registerService({username, password, email, rgpd})
      .then((_) => loginUser({ username, password }))
      .catch((e) => {
        error = e.response;
      });

    return error;
  };

  /* login method ---------------------------------------------------------- */

  let loginUser = async ({ username, password }) => {
    let error = false;
    if (username && password) {
      loginService({username, password})
        .then((response) => {
          if (response.status === 200) {
            let resTokens = response.data;
            let resUsername = jwt_decode(response.data.access).username;
            let resId = jwt_decode(response.data.access).user_id;
            let resPic = jwt_decode(response.data.access).profile_pic;
            // let resNickname = jwt_decode(response.data.access).nickname;

            setAuthTokens(resTokens);

            setUsername(resUsername);
            setUserId(resId);
            setProfilPic(resPic);
            // setNickname(resNickname);

            localStorage.setItem("authTokens", JSON.stringify(resTokens));

            navigate("/");
          }
        })
        .catch((e) => {console.log(e, "nxamr"); (error = true)});
    }

    return error;
  };

  /* logout method --------------------------------------------------------- */
    // est-ce qu'on clear le token à un moment ?
  let logoutUser = () => {
    setAuthTokens(null);
    setUsername(null);
    setUserId(null);
    setProfilPic(null);
    // setNickname(null);
    localStorage.removeItem("authTokens");
  };

  /* refresh token --------------------------------------------------------- */

  let updateToken = async () => {
    if (authTokens) {
      refreshService({refresh: authTokens?.refresh})
        .then((response) => {
          if (response.status === 200) {
            let resTokens = response.data;
            let resUsername = jwt_decode(response.data.access).username;
            let resId = jwt_decode(response.data.access).user_id;
            let resPic = jwt_decode(response.data.access).profile_pic;
            // let resNickname = jwt_decode(response.data.access).nickname;

            setAuthTokens(resTokens);

            setUsername(resUsername);
            setUserId(resId);
            setProfilPic(resPic);
            // setNickname(resNickname);

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
    profilPic,
    authTokens,
    loginUser,
    registerUser,
    logoutUser,
  };

  return <AuthContext.Provider value={contextData}>{loading ? null : children}</AuthContext.Provider>;
};
