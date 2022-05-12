import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import DisplayFriends from "@components/DisplayFriends"; // probleme de token il faut virer le decorateur dans l'url ou consommer le token

import Home from "@components/Home";
import Register from "@pages/Register";
import CreateRoom from "@components/CreateRoom";
import JoinRoom from "@components/JoinRoom";
import ChatRoom from "@components/ChatRoom";
import ChatInput from "@components/ChatInput";

const App = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
              <Route index path="/displayFriends" element={<DisplayFriends />} />
                <Route path="/" element='nothingtodohere' />
                {/* <Route path="/:roomId" element={<ChatRoom />} /> */}
                <Route path="/rooms" element='Rooms Page' />
                <Route path="/rooms/:roomId" element={<ChatRoom />} />
                <Route path="/createroom" element={<CreateRoom />} />
                <Route path="/joinroom" element={<JoinRoom />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    </>
  );
};

export default App;
