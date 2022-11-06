import React from "react";

const PublicCard = ({ room }) => {
  // TODO When description of story is too short, hover doesn't cover whole card
  const { description, title, maxParticipants, nbParticipants } = room;
  const { title: storyTitle, image: storyImage, description: storyDescription } = room.story;
  return (
    <div className="public-rooms-card">
      <div className="public-rooms-card__img">
        <img src={storyImage} alt={storyTitle} />
        <div className="public-rooms-card__hover">
          <h5>STORY DETAILS</h5>
          <div>
            <h4>{storyTitle}</h4>
            <ul>
              <li>{storyDescription}</li>
              <li className="icon__seat">{`${nbParticipants}/${maxParticipants}`} Seats</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="public-rooms-card__title">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default PublicCard;
