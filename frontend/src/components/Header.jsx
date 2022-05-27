/**
 * WIP
 */
/* gobal ------------------------------------------------------------------- */
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "@context/AuthContext";
/* mui --------------------------------------------------------------------- */
import PeopleIcon from "@mui/icons-material/People";

/* ------------------------------------------------------------------------- */
/* render                                                                    */
/* ------------------------------------------------------------------------- */

const Header = ({ contacts, handleToogle }) => {
  const { nickname, profilPic } = useContext(AuthContext);

  return (
    <div className="header">
      <div>
        <h2>
          <Link className="link" to="/">
            TALE IT
          </Link>
        </h2>
        <p>Welcome back {nickname.charAt(0).toUpperCase() + nickname.slice(1)} !</p>
      </div>
      <nav className="header__menu">
        <ul>
          <li>
            <img src={profilPic} />
          </li>
          <li onClick={handleToogle}>
            <PeopleIcon fontSize="large" />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
