/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "@context/AuthContext";

/* components -------------------------------------------------------------- */
import QuickCard from "./QuickCard";

/* ------------------------------------------------------------------------- */
/* render                                                                    */
/* ------------------------------------------------------------------------- */

const QuickCards = () => {
  const URL = "http://localhost:8000/api/room/quick_access";
  const { authTokens } = useContext(AuthContext);
  const [rooms, setRooms] = useState();

  useEffect(function fetchQuickRooms() {
    const request = axios.CancelToken.source();
    const fetch = async () => {
      await axios({
        url: URL,
        method: "GET",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        cancelToken: request.token,
      })
        .then((response) => setRooms(response.data))
        .catch((e) => console.log("error", e));
    };

    fetch();

    return () => request.cancel();
  }, []);

  return (
    <>
      {rooms
        ? rooms.map((room, id) => (
            <Link to={`/rooms/${room.id}`} key={id} className="link" state={{ alreadyUser: true }}>
              <QuickCard room={room} />
            </Link>
          ))
        : "Loading..."}
    </>
  );
};

export default QuickCards;
