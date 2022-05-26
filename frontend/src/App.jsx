import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* layout ------------------------------------------------------------------ */
import Dashboard from "@utils/Dashboard";
/* authentifications ------------------------------------------------------- */
import ConnectPage from "@pages/ConnectPage";
import PrivateRoute from "@utils/PrivateRoute";
import { AuthProvider } from "@context/AuthContext";
/* outlet ------------------------------------------------------------------ */
import Rooms from "@components/Rooms";
import GamePage from "@pages/GamePage";

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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Fragment>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
