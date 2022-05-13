//// check if a trigger is being written
//// if a trigger -> fetch all available trigger (wo filter)
//// register all available triggers in a state
// stop trigger when " " is entered
// register trigger in a state
// register all message for autocompletion
// if enter or tabe => autocompletion (decide on type of autocompletion)
//// filter through depedencies in order to get only available triggers

// you can search by origin or by the name of the trigger
// set basic trigger = whisper, etc..."@"
// can be also the dice launch
// don't forget to create a tutorial of the key gameplay elements (onboarding)

import axios from "axios";
import { useState } from "react";

const useTrigger = (token, roomId, userId) => {
  const [autocompletion, setAutocompletion] = useState(null);
  const [availableTriggers, setAvailableTriggers] = useState(null);
  const [trigger, setTrigger] = useState(null);
  const [valid, setValid] = useState(false);

  const data = { trigger, valid };

  const checkTrigger = (message) => {
    if (message.slice(-1) === "/" || autocompletion) {
      console.log("test");
      fetchTriggers();
      console.log(availableTriggers);
    }
  };

  const fetchTriggers = () => {
    axios({
      url: `http://127.0.0.1:8000/api/triggers?room_id=${roomId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      const { actions, entityInstances, events, story } = response.data.data;
      console.log({ actions, entityInstances, events, story });
    });
  };

  return [data, checkTrigger];
};

export default useTrigger;
