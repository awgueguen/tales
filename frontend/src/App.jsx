import React, {useEffect, useState} from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import DisplayFriends from "components/DisplayFriends";

import Home from "./components/Home";

const App = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route index path="/displayFriends" element={<DisplayFriends />} />
            </Routes>
        </BrowserRouter>
    </>

  )
}

export default App