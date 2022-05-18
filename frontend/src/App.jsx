import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom"; //BrowserRouter as Router
/* components -------------------------------------------------------------- */
import Header from "@components/Header";
/* pages ------------------------------------------------------------------- */
import HomePage from "@pages/HomePage";
/* authentifications ------------------------------------------------------- */
import PrivateRoute from "@utils/PrivateRoute";
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import { AuthProvider } from "@context/AuthContext";
/* chat ------------------------------------------------------- */
import RoomList from '@components/rooms/RoomList';
import CreateRoom from "@components/rooms/CreateRoom";
import JoinRoom from "@components/rooms/JoinRoom";
import ChatRoom from "@components/ChatRoom";
import FriendList from '@components/FriendList'
/* friends ------------------------------------------------------- */
import DisplayFriends from "@components/DisplayFriends";
import AddFriends from "@components/AddFriends";

const App = () => {
  return (
    <>
        <AuthProvider>
          <Fragment>
            <Header />
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                {/* anicet -------------------------------------------------------  */}
                <Route path="/displayFriends" element={<DisplayFriends />} />
                {/* Alexis -------------------------------------------------------  */}
                <Route path="/" element={<HomePage />} />
                {/* theo -------------------------------------------------------  */}
                <Route path="/friends" element={<FriendList />} />
                <Route path="/rooms" element={<RoomList />} />
                <Route path="/rooms/:roomId" element={<ChatRoom />} />
                <Route path="/createroom" element={<CreateRoom />} />
                <Route path="/joinroom" element={<JoinRoom />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Fragment>
        </AuthProvider>
    </>
  );
};

export default App;
