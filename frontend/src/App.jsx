import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* components -------------------------------------------------------------- */
/* layout ------------------------------------------------------------------ */
import Dashboard from "@utils/Dashboard";
/* authentifications ------------------------------------------------------- */
import ConnectPage from "@pages/ConnectPage";
import PrivateRoute from "@utils/PrivateRoute";
import { AuthProvider } from "@context/AuthContext";
/* chat ------------------------------------------------------- */
import Rooms from "@components/Rooms";
import CreateRoom from "@components/Rooms/CreateRoom";
import ChatRoom from "@components/ChatRoom";

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Fragment>
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />}>
                  <Route path="/" element={<Rooms />} />
                  <Route path="/rooms/:roomId" element={<ChatRoom />} />
                  <Route path="/createroom" element={<CreateRoom />} />
                </Route>
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
