import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* components -------------------------------------------------------------- */
/* layout ------------------------------------------------------------------ */
import Dashboard from "@utils/Dashboard";
/* authentifications ------------------------------------------------------- */
import ConnectPage from "@pages/ConnectPage";
import ModalRegister from '@components/ConnectPage/ModalRegister'
import PrivateRoute from "@utils/PrivateRoute";
import { AuthProvider } from "@context/AuthContext";
/* dashboard ------------------------------------------------------- */
import Rooms from "@components/Rooms";
/* game ------------------------------------------------------- */
import GamePage from '@pages/GamePage';

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
                  <Route path="/rooms/:roomId" element={<GamePage />} />
                </Route>
              </Route>
              <Route path="/welcome" element={<ConnectPage />} />
              {/* il faudra rendre cette route privée et uniquement accessible via le link de connectPage */}
              <Route path="/welcome/last-step" element ={<ModalRegister />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Fragment>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
