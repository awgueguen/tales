/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React from "react";

const QuickCards = ({ room }) => {
  const { title } = room;
  const { image } = room.story;
  return (
    <div className="sidebar__quickcard">
      <div className="sidebar__quickcard__img">
        <img src={image} alt={title} />
      </div>
      <span>{title}</span>
    </div>
  );
};

export default QuickCards;
