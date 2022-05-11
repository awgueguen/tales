import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "@context/AuthContext";

const Header = () => {
  let { username, logoutUser } = useContext(AuthContext);

  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>
      {username ? <a onClick={logoutUser}>Logout</a> : <Link to="/login">Login</Link>}

      {username && <p>Hello {username}</p>}
    </div>
  );
};

export default Header;
