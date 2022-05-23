import React from 'react'

const ChatInput = (props) => {
  const {autocompletion, trigger, triggerCandidates, newMessage, msgChange, submitMessage} = props;
  return (
    <div className='limite_composant'>
      ChatInput
      <div id="search_container">
        <div id="autocomplete">{autocompletion ? autocompletion : null}</div>
        <input
          value={newMessage}
          onChange={msgChange}
          placeholder="Write message..."
          className="new-message-input-field"
        />
      </div>
      <button onClick={submitMessage} className="send-message-button">
        Send
      </button>
      <p>
        Trigger: {trigger ? trigger["trigger"] : null} - {autocompletion ? autocompletion : null}
      </p>
      <ul>
        {triggerCandidates?.map((candidate) => (
          <li>
            {candidate["trigger"]} : {candidate["title"] ? candidate["title"] : candidate["name"]}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatInput