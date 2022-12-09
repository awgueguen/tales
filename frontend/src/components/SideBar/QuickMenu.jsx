/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "@context/AuthContext";

/* components -------------------------------------------------------------- */
import QuickCard from "./QuickCard";

/* services ---------------------------------------------------------------- */
import {getQuickAccesRooms} from "@services/rooms/rooms.services"

/* ------------------------------------------------------------------------- */
/* render                                                                    */
/* ------------------------------------------------------------------------- */

const QuickCards = () => {
  
  const { authTokens } = useContext(AuthContext);
  const [rooms, setRooms] = useState();
  let location = useLocation();
  let navigate = useNavigate();

  const changeLocation = (e) => {
    navigate(e, { replace: true });
    window.location.reload();
  };

  /**
   * Using the location.key, the list is updated even if we just created a room.
   */
  useEffect(() => {
    getQuickAccesRooms(authTokens.access)
      .then((response) => setRooms(response))
      .catch((error) => console.log(error))
  
    },[location.key, authTokens.access]
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
