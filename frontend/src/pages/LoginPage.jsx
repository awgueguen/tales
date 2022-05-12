/* gobal ------------------------------------------------------------------- */
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";

/* ------------------------------------------------------------------------- */
/* export                                                                    */
/* ------------------------------------------------------------------------- */

const LoginPage = () => {
  let { loginUser, username } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      {username ? null : (
        <form onSubmit={loginUser}>
          <input type="text" name="username" placeholder="enter username" />
          <input type="password" name="password" placeholder="enter password" />
          <input type="submit" />
        </form>
      )}
    </div>
  );
};

export default LoginPage;
