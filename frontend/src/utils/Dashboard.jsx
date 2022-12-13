/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

/* components -------------------------------------------------------------- */
import Contacts from "@components/Contacts";
import Header from "@components/Header";
import SideBar from "@components/SideBar";

const Dashboard = () => {
  // c'est toogle* jcrois bg :c
  const [contacts, toogleContacts] = useState(false);
  const [gameMode, setGameMode] = useState();
  const location = useLocation();

  const handleToogle = () => {
    toogleContacts(!contacts);
  };

  useEffect(() => {
    if (location.pathname.startsWith("/rooms/")) {
      // ! DEBUG
      setGameMode(true);
    } else {
      setGameMode(false);
    }
  }, [location]);

  /* display --------------------------------------------------------------- */

  return (
    <div id="dashboard">
      <div className={`dashboard__grid ${gameMode ? "game-active" : ""}`}>
        <Header handleToogle={handleToogle} contacts={contacts} />
        <SideBar />
        <div className="dahsboard__container">
          <Outlet />
        </div>
      </div>
      <div className={`contacts ${contacts ? "active" : ""}`}>
        <Contacts handleToogle={handleToogle} contacts={contacts} />
      </div>
    </div>
  );
};

export default Dashboard;
