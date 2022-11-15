/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React from "react";
import { Link } from "react-router-dom";

/* components -------------------------------------------------------------- */
import InRoomCard from "./InRoomCard";
import AddRoomModal from "./AddRoomModal";

const InRooms = ({ userId, rooms, handleModal, ...props }) => {
  return (
    <>
      <h4>MY ROOMS</h4>
      <div className="inrooms__container">
        <div className="inrooms__cards">
          {rooms
            ? rooms.map((room, id) => {
                let isAdmin = room.participants.find((i) => i.user.id === userId).isAdmin;
                return (
                  <Link to={`/rooms/${room.id}`} key={id} className="link">
                    <InRoomCard room={room} admin={isAdmin} />
                  </Link>
                );
              })
            : "Loading..."}
          {/* add an empty card at the end to create a new room */}
          <div className="inrooms-card" onClick={handleModal}>
            <div className="inrooms-card__add">
              <button className="btn-text-only">
                <h5>CREATE NEW ROOM</h5>
              </button>
            </div>
          </div>
          <AddRoomModal handleModal={handleModal} {...props} />
        </div>
      </div>
    </>
  );
};

export default InRooms;
