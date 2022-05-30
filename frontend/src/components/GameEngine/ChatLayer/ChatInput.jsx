import React from "react";

const ChatInput = (props) => {
  const { newMessage, msgChange, submitMessage } = props;
  return (
    <div className="ge-center__input__container">
      <form onSubmit={submitMessage}>
        <input
          value={newMessage}
          onChange={msgChange}
          placeholder="Write message..."
          type="text"
          className="ge-center__input__sendinput"
        />
        <div className="ge-center__input__submit">
          <input type="submit" hidden />
          <button type="submit" className="btn-text-only" onClick={submitMessage}>
            SEND
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
