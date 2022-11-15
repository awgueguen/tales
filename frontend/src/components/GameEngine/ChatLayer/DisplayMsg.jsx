import React from "react";

const DisplayMsg = ({ messages }) => {
  return (
    <div className="ge-center__messages__container">
      {messages?.map((message, index, allMessages) => {
        const nextMessage = allMessages[index + 1];
        const prevMessage = allMessages[index - 1];
        // next variables are used to check the display settings of each message
        const lastUserMessage = !!prevMessage ? prevMessage.user !== message.user : true;
        const firstUserMessage = !!nextMessage ? nextMessage.user !== message.user : true;

        return (
          <React.Fragment key={index}>
            {message.log ? (
              <div className="ge-center__messages__log">{message.data}</div>
            ) : (
              <div className={message.ownedByCurrentUser ? "my-message" : ""}>
                {firstUserMessage ? <span className={`chat-user-name`}>{message.user}</span> : ""}

                {message.img ? (
                  <div className={`ge-center__messages__message message-img`}>
                    <img alt={"chat img"} src={message.img} />
                  </div>
                ) : (
                  ""
                )}

                <p className={`ge-center__messages__message ${message.ownedByCurrentUser ? "my-message" : ""}`}>
                  {message.data}
                </p>

                {lastUserMessage ? <span className={`chat-user-infos`}>{`${message.date}`}</span> : ""}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DisplayMsg;
