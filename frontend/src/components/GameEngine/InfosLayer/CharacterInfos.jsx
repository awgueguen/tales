import React, { useState, useEffect } from "react";
import ConstructionIcon from "@mui/icons-material/Construction";

const CharacterInfos = ({ character }) => {
  const [isDM, setIsDM] = useState(false);

  useEffect(() => {
    console.log(character);
    setIsDM(!character);
  }, [character]);

  return (
    <div className="ge-top__character">
      {isDM ? (
        <div className="ge-top__character__dm">
          <ConstructionIcon />
          <h4>DUNGEON MASTER</h4>
        </div>
      ) : character ? (
        <div className="ge-top__character__infos">
          <h4>{character.name}</h4>
          <h5>{character.characterClass.name}</h5>
          <ul>
            <li>HP: {character.characterClass.hp}</li>
            <li>ATK: {character.characterClass.atk}</li>
            <li>DEF: {character.characterClass.defense}</li>
          </ul>
          <h5>{character.weapon}</h5>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CharacterInfos;
