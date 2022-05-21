import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* components -------------------------------------------------------------- */
/* pages ------------------------------------------------------------------- */
import HomePage from "@pages/HomePage";
/* authentifications ------------------------------------------------------- */
import ConnectPage from "@pages/ConnectPage";
import PrivateRoute from "@utils/PrivateRoute";
import { AuthProvider } from "@context/AuthContext";
/* chat ------------------------------------------------------- */
import RoomList from "@components/rooms/RoomList";
import CreateRoom from "@components/rooms/CreateRoom";
import JoinRoom from "@components/rooms/JoinRoom";
import ChatRoom from "@components/ChatRoom";
/* friends ------------------------------------------------------- */
import DisplayFriends from "@components/DisplayFriends";

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
                <Route path="/rooms" element={<RoomList />} />
                <Route path="/rooms/:roomId" element={<ChatRoom />} />
                <Route path="/createroom" element={<CreateRoom />} />
                <Route path="/joinroom" element={<JoinRoom />} />
              </Route>
              <Route path="/welcome" element={<ConnectPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Fragment>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
