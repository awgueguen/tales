/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "@context/AuthContext";

/* components -------------------------------------------------------------- */
import PublicRooms from "@components/Rooms/PublicRooms";
import InRooms from "@components/Rooms/InRooms";

/* services ---------------------------------------------------------------- */
import { getUserRooms } from "@services/rooms/rooms.services";

const Rooms = (props) => {
  /* global ---------------------------------------------------------------- */
  const { authTokens, userId } = useContext(AuthContext);

  /* states ---------------------------------------------------------------- */
  const [roomsIn, setRoomsIn] = useState([]);
  const [roomsPublic, setRoomsPublic] = useState([]);

  /* lifecycle ------------------------------------------------------------- */

  useEffect(function fetchRooms() {

    getUserRooms(authTokens.access)
      .then((response) => {
        setRoomsIn([]);
        setRoomsPublic([]);

        response.forEach((room) => {
          if (room.participants.some((e) => e.user.id === userId)) {
            setRoomsIn((prevValue) => [...prevValue, room]);
          } else if (room.isPublic) {
            setRoomsPublic((prevValue) => [...prevValue, room]);
          }
        });
      })
      .catch((error) => {
        if (error.response.status === 500) {
          console.log("Not Connected");
        }
      })
    // eslint-disable-next-line
  }, [authTokens.access, ]);

  /* room creation --------------------------------------------------------- */


  // handle the modal process
  const handleModal = () => {
    const modal = document.querySelector(".addroom__container");
    if (modal.hasAttribute("open")) {
      modal.close();
    } else {
      modal.showModal();
    }
  };


  /* display --------------------------------------------------------------- */

  return (
    <div className="rooms">
      <InRooms
        userId={userId}
        rooms={roomsIn}
        handleModal={handleModal}
      />
      <PublicRooms rooms={roomsPublic} userId={userId} />
    </div>
  );
};

export default Rooms;
