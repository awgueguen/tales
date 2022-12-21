import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* layout ------------------------------------------------------------------ */
import Dashboard from "@utils/Dashboard";
/* authentifications ------------------------------------------------------- */
import ConnectPage from "@pages/ConnectPage";
import { AuthProvider } from "@context/AuthContext";
/* utils ------------------------------------------------------------------- */
import PrivateRoute from "@utils/PrivateRoute";
import RoomAccess from "./utils/RoomAccess";
/* outlet ------------------------------------------------------------------ */
import Rooms from "@pages/Rooms";
import GameEngine from "@pages/GameEngine";

/* temporary -------------------------------------------------------------- */
import Profile from '@components/Profile/EditProfile';
// import './i18n';

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Fragment>
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />}>
                <Route path='/profileTest' element={<Profile />} />
                  <Route path="/" element={<Rooms />} />
                  <Route path="/" element={<RoomAccess />}>
                    <Route path="/rooms/:roomId" element={<GameEngine />} />
                  </Route>
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
