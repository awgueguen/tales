import React from "react";

const CharacterCard = ({ id, name, image, background, characterClass, setCharacter }) => {
  const { name: classTitle, hp, atk, defense } = characterClass;
  return (
    // We can modify here the multiple elements of a character's card
    <div className="duat__card">
      <div className="duat__img image__stats__container">
        <img src={image} alt={name} />
        <div className="image__stats__hp">
          <h3>{hp}</h3>
          <h4>HP</h4>
        </div>
        <div className="image__stats__atk">
          <h3>{atk}</h3>
          <h4>ATK</h4>
        </div>
        <div className="image__stats__def">
          <h3>{defense}</h3>
          <h4>DEF</h4>
        </div>
        <div className="image__stats__name">
          <h4>{name}</h4>
          <h5>{classTitle}</h5>
        </div>
      </div>
      <p>{background?.length < 150 ? background : background.substring(0, 150) + "..."}</p>
      <button className="btn-text-only" onClick={() => setCharacter({ id, name: name })}>
        SELECT
      </button>
    </div>
  );
};

export default CharacterCard;
