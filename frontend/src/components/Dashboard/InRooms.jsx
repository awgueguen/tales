/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React from "react";
import { Link } from "react-router-dom";

/* components -------------------------------------------------------------- */
import InRoomCard from "./InRoomCard";

const InRooms = ({ rooms, ...props }) => {
  return (
    <>
      <h4>MY ROOMS</h4>
      <div className="inrooms__container">
        <div className="inrooms__cards">
          {rooms
            ? rooms.map((room, id) => (
                <Link to={`/rooms/${room.room.id}`} key={id} className="link" state={{ alreadyUser: true }}>
                  <InRoomCard room={room.room} admin={room.isAdmin} />
                </Link>
              ))
            : "Loading..."}
          <div className="inrooms-card">
            <div className="inrooms-card__add">
              <h5>CREATE NEW ROOM</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InRooms;
