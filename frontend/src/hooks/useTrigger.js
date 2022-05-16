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
import { useState, useRef, useEffect } from "react";

const useTrigger = (token, roomId) => {
  const [autocompletion, setAutocompletion] = useState(null);
  const [availableTriggers, setAvailableTriggers] = useState(null);

  const [trigger, setTrigger] = useState(null);

  const error = useRef(null);

  const checkTrigger = (message) => {
    // cas où pas de trigger
    // cas où trigger détecté = "/" & pas d'available trigger
    // cas où trigger & recherche
    //    enregistrement simple & modification du available trigger
    //    cas où reset donc "/" est effacé
    // cas validation du trigger = " "
    //    cas où availableTrigger.length == 1
    //    cas où availableTrigger > 1
    //    cas où availableTrigger = 0 => reset
    // if (message.slice(-1) === "/" && !availableTriggers) {
    //   fetchInitialTriggers();
    //   setAutocompletion(message);
    // }
    // else if (trigger && !message.slice(-1).match(/^[a-z0-9]+$/i)) {
    // setTrigger(message.slice(message.indexOf("/") + 1));
  };

  // useEffect(() => {
  //   if (trigger) {
  //     const newSet = availableTriggers.filter((elem) => elem["trigger"].startsWith(trigger));
  //     setAvailableTriggers(() => {
  //       return newSet;
  //     });

  //     console.log({ trigger });
  //   }
  //   return setTrigger(() => null);
  // }, [trigger]);

  const fetchInitialTriggers = () => {
    axios({
      url: `http://127.0.0.1:8000/api/triggers?room_id=${roomId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setAvailableTriggers(response.data[0]);
    });
  };

  return [checkTrigger];
};

export default useTrigger;
