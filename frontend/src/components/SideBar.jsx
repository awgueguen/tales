/**
 * * CLEAN CODE
 */
/* gobal ------------------------------------------------------------------- */
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "@context/AuthContext";

/* context & components ---------------------------------------------------- */
import QuickCards from "./SideBar/QuickMenu";

/* ------------------------------------------------------------------------- */
/* render                                                                    */
/* ------------------------------------------------------------------------- */

const SideBar = () => {
  const { logoutUser } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <nav className="sidebar__pages">
        <ul>
          <li className="icon__room active">
            <Link className="link" to="/">
              Rooms
            </Link>
          </li>
          <li className="icon__assets">
            <Link className="link" to="/assets/">
              Assets
            </Link>
          </li>
          <li className="icon__characters">
            <Link className="link" to="/characters/">
              Characters
            </Link>
          </li>
          {/* <li onClick={logoutUser}>DEBUG: LOGOUT</li> */}
        </ul>
      </nav>
      <h5>QUICK ACCESS</h5>
      <nav className="sidebar__rooms">
        <QuickCards />
      </nav>
    </div>
  );
};

export default SideBar;
