/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";

/* components -------------------------------------------------------------- */
import Contacts from "@components/Contacts";
import Header from "@components/Header";
import SideBar from "@components/SideBar";

const Dashboard = () => {
  const [contacts, toogleContacts] = useState(false);

  const handleToogle = () => {
    toogleContacts(!contacts);
  };

  /* lifecycle ------------------------------------------------------------- */

  /* display --------------------------------------------------------------- */

  return (
    <div id="dashboard">
      <div className="dashboard__grid">
        <Header handleToogle={handleToogle} contacts={contacts} />
        <SideBar />
        <div className="dahsboard__container">
          <Outlet />
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
