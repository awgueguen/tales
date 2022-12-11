// pourquoi triggerCandidates est aussi rempli avec le fetch ?

// import axios from "axios";
import { useState } from "react";

import {getRoomTriggers} from '@services/triggers/triggers.services';

const useTrigger = (token, roomId, isAdmin) => {
  const [availableTriggers, setAvailableTriggers] = useState(null);
  const [triggerCandidates, setTriggerCandidates] = useState(null);
  const [trigger, setTrigger] = useState(null);

  const checkTrigger = (message) => {
    let lastCharacter = message.slice(-1);
    let hasSlash = message.includes("/");

    if (lastCharacter === "/" && !availableTriggers) {
      fetchInitialTriggers();
    } else if (hasSlash && lastCharacter.match(/^[a-z0-9]+$/i)) {
      // TODO: multiple "/" + comparaison minuscule / majuscule
      const possibleTrigger = message.slice(message.indexOf("/") + 1);

      setTriggerCandidates(() => {
        let triggers = availableTriggers?.filter((commands) =>
          commands["trigger"].toLowerCase().startsWith(possibleTrigger.toLowerCase())
        );
        return triggers;
      });

      if (trigger) {
        setTrigger(null);
      }
    } else if (hasSlash) {
      if (triggerCandidates.length === 1) {
        setTrigger(triggerCandidates[0]);
      } else if (lastCharacter === "/") {
        setTriggerCandidates(availableTriggers);
      }
    } else {
      setTriggerCandidates(null);
      setAvailableTriggers(null);
    }
  };

  const fetchInitialTriggers = async () => {
    getRoomTriggers(token, roomId)
      .then((response) => {
        if (!isAdmin) {
          setTriggerCandidates(response[0].filter((command) => command["tab"] === "Action"));
          setAvailableTriggers(response[0].filter((command) => command["tab"] === "Action"));
        } else {
          setTriggerCandidates(response[0]);
          setAvailableTriggers(response[0]);
        }})
      .catch((error)=> console.log(error))
    // await axios({
    //   url: `http://127.0.0.1:8000/api/triggers?room_id=${roomId}`,
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // }).then((response) => {
    //   if (!isAdmin) {
    //     setTriggerCandidates(response.data[0].filter((command) => command["tab"] === "Action"));
    //     setAvailableTriggers(response.data[0].filter((command) => command["tab"] === "Action"));
    //   } else {
    //     setTriggerCandidates(response.data[0]);
    //     setAvailableTriggers(response.data[0]);
    //   }
    // });
  };

  const reset = () => {
    setAvailableTriggers(() => "");
  };

  return [checkTrigger, triggerCandidates, trigger, reset];
};

export default useTrigger;
