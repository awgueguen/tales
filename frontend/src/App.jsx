import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* layout ------------------------------------------------------------------ */
import Dashboard from "@utils/Dashboard";
/* authentifications ------------------------------------------------------- */
import ConnectPage from "@pages/ConnectPage";
import ModalRegister from "@components/ConnectPage/ModalRegister";
import { AuthProvider } from "@context/AuthContext";
/* utils ------------------------------------------------------------------- */
import PrivateRoute from "@utils/PrivateRoute";
import RoomAccess from "./utils/RoomAccess";
/* outlet ------------------------------------------------------------------ */
import Rooms from "@pages/Rooms";
import GamePage from "@pages/GamePage";
import GameEngine from "@pages/GameEngine";

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
                  <Route path="/" element={<RoomAccess />}>
                    <Route path="/test/:roomId" element={<GameEngine />} />

                    <Route path="/rooms/:roomId" element={<GamePage />} />
                  </Route>
                </Route>
              </Route>
              <Route path="/welcome" element={<ConnectPage />} />
              {/*  WIP -------------------------------------------------------  */}
              {/* il faudra rendre cette route privée et uniquement accessible via le link de connectPage */}
              <Route path="/welcome/last-step" element={<ModalRegister />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Fragment>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
