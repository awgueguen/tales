import React, { useState, useEffect } from "react";

const EventLayer = ({ lastEvent }) => {
  const [entity, setEntity] = useState(false);

  useEffect(() => {
    try {
      setEntity(!!lastEvent.name);
    } catch (e) {
      //   console.log(e);
    }
  }, [lastEvent]);

  return lastEvent ? (
    <>
      <div className="ge-left__card image__stats__container">
        <img src={lastEvent.image} alt={lastEvent.title} />
        {entity ? (
          <>
            <div className="image__stats__hp">
              <h3>{lastEvent.hp}</h3>
              <h4>HP</h4>
            </div>
            <div className="image__stats__atk">
              <h3>{lastEvent.atk}</h3>
              <h4>ATK</h4>
            </div>
            <div className="image__stats__def">
              <h3>{lastEvent.defense}</h3>
              <h4>DEF</h4>
            </div>
            <div className="image__stats__name">
              <h4>{lastEvent.name}</h4>
            </div>
          </>
        ) : (
          <div className="image__stats__name">
            <h4>{lastEvent.title}</h4>
          </div>
        )}
      </div>
      {/* <pre>{JSON.stringify(lastEvent, null, 2)}</pre> */}
    </>
  ) : (
    "NO EVENT YET"
  );
};

export default EventLayer;
