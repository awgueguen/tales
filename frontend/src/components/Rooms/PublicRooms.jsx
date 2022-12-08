/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React from "react";
import { Link } from "react-router-dom";

/* components -------------------------------------------------------------- */
import PublicCard from "./PublicCard";

const PublicRooms = ({ rooms, userId }) => {
  return (
    <>
      <h4>PUBLIC ROOMS</h4>
      <div className="public-rooms__container">
        <div className="public-rooms__cards">
          {rooms
            ? rooms
                .filter((room) => !room.participants.some((participant) => participant.user === userId)) // check if the user is already in a room
                .sort((i, j) => j.maxParticipants - j.participants.length - (i.maxParticipants - i.participants.length)) // sort the rooms from the more space to less space
                .map((room, id) =>
                  room.participants.length === room.maxParticipants ? (
                    // Case 1 : a room is full
                    <div key={id} className="public-rooms-card__full">
                      <PublicCard room={room} />
                    </div>
                  ) : (
                    // Case 2 ; There is still some seats available
                    <Link to={`/rooms/${room.id}`} key={id} className="link">
                      <PublicCard room={room} />
                    </Link>
                  )
                )
            : "Loading..."}
        </div>
      </div>
    </>
  );
};

export default PublicRooms;
