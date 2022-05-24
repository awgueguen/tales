/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React from "react";
import { Link } from "react-router-dom";

/* components -------------------------------------------------------------- */
import PublicCard from "./PublicCard";

const PublicRooms = ({ rooms }) => {
  return (
    <>
      <h4>PUBLIC ROOMS</h4>
      <div className="public-rooms__container">
        <div className="public-rooms__cards">
          {rooms
            ? rooms
                .sort((i, j) => j.maxParticipants - j.participants.length - (i.maxParticipants - i.participants.length))
                .map((room, id) =>
                  room.participants.length === room.maxParticipants ? (
                    <div key={id} className="public-rooms-card__full">
                      <PublicCard room={room} />
                    </div>
                  ) : (
                    <Link to={`/rooms/${room.id}`} key={id} className="link" state={{ participant: false }}>
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
