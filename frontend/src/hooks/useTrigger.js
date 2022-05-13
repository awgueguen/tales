// retrive new character in state > message
// if new character is "/" => start the autocompletion trigger
// at the moment trigger a fetch of the possible actions with the info of the origin
// you can search by origin or by the name of the trigger
// propose a completion on the same line
// if enter or tab => send validate the trigger name
// don't forget to create a tutorial of the key gameplay elements (onboarding)
// can be also the dice launch
// other solution, a list of the possible elements to guide the completion

import { useEffect, useState } from "react";

const useTrigger = (token) => {
  const [autocompletion, setAutocompletion] = useState(null);
  const [trigger, setTrigger] = useState(null);
  const [valid, setValid] = useState(false);

  const data = { trigger, valid };

  const checkTrigger = (message) => {
    if (message.slice(-1) === "/" || autocompletion) {
      console.log("test");
      // add the rest when trigger is detected, and stock in trigger
    }
  };
  // récupérer la dernière lettre du message
  //

  return [data, checkTrigger];
};

export default useTrigger;
