import React from "react";

/* components -------------------------------------------------------------- */
import Narration from "./InfosLayer/Narration";
import CharacterInfos from "./InfosLayer/CharacterInfos";

const InfosLayer = ({ messages, character, lastEvent }) => {
  return (
    <>
      <Narration messages={messages} lastEvent={lastEvent} />
      <CharacterInfos character={character} />
    </>
  );
};

export default InfosLayer;
