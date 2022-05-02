import React, {useEffect, useState} from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

import Home from "./pages/Home";

const App = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    </>

  )
}

export default App