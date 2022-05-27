import React from "react";

const CharacterCard = ({ id, name, image, background, characterClass, character, setCharacter }) => {
  const { name: classTitle, hp, atk, defense } = characterClass;
  return (
    <div className="duat__card">
      <div className="duat__img">
        <img src={image} alt={name} />
      </div>
      <div className="duat__description">
        <h4>{name}</h4>
        <h4>{classTitle}</h4>
      </div>
      <div className="duat__stats">
        <h4>HP: {hp}</h4>
        <h4>ATK: {atk}</h4>
        <h4>DEF: {defense}</h4>
      </div>
      <p>{background}</p>
      <button className="btn-text-only" onClick={() => setCharacter({ id, name: name })}>
        SELECT
      </button>
    </div>
  );
};

export default CharacterCard;
