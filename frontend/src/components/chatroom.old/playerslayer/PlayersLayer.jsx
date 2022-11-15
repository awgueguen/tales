// OK

import React, { useEffect, useState } from "react";
import PlayerIcon from "@chatroom/playerslayer/PlayerIcon";

const PlayersLayer = (props) => {
  /**
   * TODO: ajouter player.isActive
   *
   */
  const { players, userId } = props;
  const [otherPlayers, setOtherPlayers] = useState();

  useEffect(() => {
    if (!players) return;
    setOtherPlayers(players.filter((player) => player.user !== userId));
    //eslint-disable-next-line
  }, [players]);

  useEffect(() => {}, [otherPlayers]);
  return (
    <div className="limite_composant">
      TEAM
      <ul>
        {otherPlayers &&
          otherPlayers.map((player, index) => {
            return <PlayerIcon {...player} index={index} />;
          })}
      </ul>
    </div>
  );
};

export default PlayersLayer;