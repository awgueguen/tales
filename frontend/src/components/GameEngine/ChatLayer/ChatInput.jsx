import React from "react";

const ChatInput = (props) => {
  const { newMessage, msgChange, submitMessage, triggerCandidates } = props;
  return (
    <div className="ge-center__input__container">
      {/* display hovering above the available triggers */}
      {triggerCandidates ? (
        <div className="triggers">
          {triggerCandidates?.map((candidate, index) => (
            <div>
              <div className="triggers_tab">{candidate.tab}</div>
              <div className="triggers_name">{candidate.name ? candidate.name : candidate.title}</div>
              <div className="triggers_trigger">/{candidate.trigger}</div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}

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
