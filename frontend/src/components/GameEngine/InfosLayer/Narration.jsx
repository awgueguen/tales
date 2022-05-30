import React from "react";

const Narration = ({ messages }) => {
  return (
    <div className="ge-top__narration">
      {messages
        ? messages.map((message, index, allMessages) => {
            try {
              return (
                <div
                  key={index}
                  className={`ge-top__narration__message ${index === allMessages.length - 1 ? "last-message" : ""}`}
                >
                  {JSON.parse(message.data).description}
                </div>
              );
            } catch (e) {
              // console.log(e);
            }
          })
        : "NO EVENT YET"}
    </div>
  );
};

export default Narration;
