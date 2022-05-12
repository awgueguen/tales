/* gobal ------------------------------------------------------------------- */
import React, { useContext } from "react";
/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";

/* ------------------------------------------------------------------------- */
/* export                                                                    */
/* ------------------------------------------------------------------------- */

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  return (
    <div>
      <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder="enter username" />
        <input type="password" name="password" placeholder="enter password" />
        <input type="submit" />
      </form>
    </div>
  );
};

export default LoginPage;
