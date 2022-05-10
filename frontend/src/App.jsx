import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
/* components -------------------------------------------------------------- */
import DisplayFriends from "@components/DisplayFriends";
import Header from "@components/Header";
/* pages ------------------------------------------------------------------- */
import HomePage from "@pages/HomePage";
import LoginPage from "@pages/LoginPage";
/* utils ------------------------------------------------------------------- */
import PrivateRoute from "@utils/PrivateRoute";

const App = () => {
  return (
    <>
      <Router>
        <Fragment>
          <Header />
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/displayFriends" element={<DisplayFriends />} />
          </Routes>
        </Fragment>
      </Router>
    </>
  );
};

export default App;
