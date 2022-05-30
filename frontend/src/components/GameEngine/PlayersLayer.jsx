import React from "react";

const PlayersLayer = ({ participants }) => {
  return (
    <>
      <h5>TEAM</h5>
      <div className="ge-right__players">
        {participants
          ?.filter((player) => !player.isAdmin && player["character"])
          .map((player, index) => (
            <div key={index} className="ge-right__players__img">
              <img src={player.character.image} alt={player.nickname} />
            </div>
          ))}
      </div>
    </>
  );
};

export default PlayersLayer;
