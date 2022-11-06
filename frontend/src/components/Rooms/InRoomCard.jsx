import React from "react";

/* render ------------------------------------------------------------------ */
const InRoomCard = ({ room, admin }) => {
  // TODO When description is too short, hover doen't cover whole card.
  const { description, title } = room;
  const { title: storyTitle, image: storyImage } = room.story;

  return (
    <div className="inrooms-card">
      <div className="inroom-card__shown">
        <div className="inrooms-card__img">
          <img src={storyImage} alt={storyTitle} />
          <div className="inrooms-card__hover">
            {/* <h4>{storyTitle}</h4> */}
            <p>{description}</p>
          </div>
          {admin ? (
            <div className="inrooms-card__label">
              <h5>DUNGEON MASTER</h5>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="inrooms-card__title">{title}</div>
    </div>
  );
};

export default InRoomCard;
