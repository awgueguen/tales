/* gobal ------------------------------------------------------------------- */
import React, { useContext } from "react";
import { Link } from "react-router-dom";
/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";

/* ------------------------------------------------------------------------- */
/* export                                                                    */
/* ------------------------------------------------------------------------- */

const Header = () => {
  let { username, logoutUser } = useContext(AuthContext);

  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>
      <Link to="/rooms/1">Test Room</Link>
      <span> | </span>

      {username ? <span onClick={logoutUser}>Logout</span> : <Link to="/login">Login</Link>}
      {username ? "" : <Link to="/register"> | Register</Link>}

      {username && <p>Hello {username}</p>}
    </div>
  );
};

export default Header;
