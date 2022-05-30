//// check if a trigger is being written
//// if a trigger -> fetch all available trigger (wo filter)
//// register all available triggers in a state
//// stop trigger when " " is entered
//// register trigger in a state
//// filter through depedencies in order to get only available triggers

// you can search by origin or by the name of the trigger
// set basic trigger = whisper, etc..."@"
// can be also the dice launch
// don't forget to create a tutorial of the key gameplay elements (onboarding)

import axios from "axios";
import { useState } from "react";
// import useAutocomplete from "@hooks/useAutocomplete";

const useTrigger = (token, roomId, isAdmin) => {
  // const [autocompletion, displayAutocomplete] = useAutocomplete();

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
        let triggers = availableTriggers?.filter((commands) => commands["trigger"].startsWith(possibleTrigger));
        // displayAutocomplete(message, triggers);
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
        // displayAutocomplete(message, triggerCandidates);
      }
    } else {
      setTriggerCandidates(null);
      setAvailableTriggers(null);
    }
  };

  const fetchInitialTriggers = async () => {
    await axios({
      url: `http://127.0.0.1:8000/api/triggers?room_id=${roomId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (!isAdmin) {
        setTriggerCandidates(response.data[0].filter((command) => command["tab"] === "Action"));
        setAvailableTriggers(response.data[0].filter((command) => command["tab"] === "Action"));
      } else {
        setTriggerCandidates(response.data[0]);
        setAvailableTriggers(response.data[0]);
      }
    });
  };

  return [checkTrigger, triggerCandidates, trigger]; // autocompletion
};

export default useTrigger;
