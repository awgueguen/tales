import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* components -------------------------------------------------------------- */
/* pages ------------------------------------------------------------------- */
import HomePage from "@pages/HomePage";
/* authentifications ------------------------------------------------------- */
import PrivateRoute from "@utils/PrivateRoute";
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import { AuthProvider } from "@context/AuthContext";
/* chat ------------------------------------------------------- */
import CreateRoom from "@components/CreateRoom";
import JoinRoom from "@components/JoinRoom";
import ChatRoom from "@components/ChatRoom";
/* friends ------------------------------------------------------- */
import DisplayFriends from "@components/DisplayFriends";
import AddFriends from "@components/AddFriends";

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Fragment>
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                {/* anicet -------------------------------------------------------  */}
                <Route path="/displayFriends" element={<DisplayFriends />} />
                {/* Alexis -------------------------------------------------------  */}
                <Route path="/" element={<HomePage />} />
                {/* theo -------------------------------------------------------  */}
                <Route path="/rooms" element="Rooms Page" />
                <Route path="/rooms/:roomId" element={<ChatRoom />} />
                <Route path="/createroom" element={<CreateRoom />} />
                <Route path="/joinroom" element={<JoinRoom />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Fragment>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
