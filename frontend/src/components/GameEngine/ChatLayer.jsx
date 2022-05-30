/* global ------------------------------------------------------------------ */
import React from "react";

/* components -------------------------------------------------------------- */
import DisplayMsg from "./ChatLayer/DisplayMsg";
import ChatInput from "./ChatLayer/ChatInput";

const ChatLayer = ({ messages, handleInput }) => {
  return (
    <>
      <DisplayMsg messages={messages} />
      <ChatInput {...handleInput} />
    </>
  );
};

export default ChatLayer;
