/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  let location = useLocation();
  let navigate = useNavigate();

  const changeLocation = (e) => {
    navigate(e, { replace: true });
    window.location.reload();
  };

  useEffect(
    function fetchQuickRooms() {
      const request = axios.CancelToken.source();
      const apiConnect = async () => {
        await axios({
          url: URL,
          method: "GET",
          headers: { Authorization: `Bearer ${authTokens.access}` },
          cancelToken: request.token,
        })
          .then((response) => setRooms(response.data))
          .catch((e) => console.log("error", e));
      };

      apiConnect();
      return () => request.cancel();
    },
    // eslint-disable-next-line
    [location.key]
  );

  return (
    <>
      {rooms
        ? rooms.map((room, id) => (
            <Link
              to={`/rooms/${room.id}`}
              onClick={() => changeLocation(`/rooms/${room.id}`)}
              key={id}
              className="link"
            >
              <QuickCard room={room} />
            </Link>
          ))
        : "Loading..."}
    </>
  );
};

export default QuickCards;
