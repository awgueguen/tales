import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import DisplayFriends from "@components/DisplayFriends";

import Home from "@components/Home";
import Register from "@pages/Register";

const App = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route index path="/displayFriends" element={<DisplayFriends />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    </>
  );
};

export default App;
