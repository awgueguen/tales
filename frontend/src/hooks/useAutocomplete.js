// register all message for autocompletion
// if enter or tab => autocompletion (decide on type of autocompletion)

import { useState } from "react";

const useAutocomplete = () => {
  const [autocompletion, setAutocompletion] = useState(null);

  const displayAutocompletion = (message, triggerCandidates) => {
    if (message.slice(-1) === "/") {
      setAutocompletion(null);
    } else if (message && triggerCandidates.length > 0) {
      setAutocompletion(
        `${message.slice(0, message.indexOf("/"))}/${
          triggerCandidates[0]["trigger"]
        }`
      );
    } else {
      setAutocompletion(null);
    }
  };

  return [autocompletion, displayAutocompletion];
};

export default useAutocomplete;
