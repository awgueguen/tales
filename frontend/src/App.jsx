import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
/* components -------------------------------------------------------------- */
import DisplayFriends from "@components/DisplayFriends";
import Header from "@components/Header";
/* pages ------------------------------------------------------------------- */
import HomePage from "@pages/HomePage";
/* authentifications ------------------------------------------------------- */
import PrivateRoute from "@utils/PrivateRoute";
import LoginPage from "@pages/LoginPage";
import { AuthProvider } from "@context/AuthContext";

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
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
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
