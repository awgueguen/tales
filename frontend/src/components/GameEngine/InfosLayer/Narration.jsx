import React from "react";

const Narration = ({ messages }) => {
  return (
    <div className="ge-top__narration">
      {messages
        ? messages.map((message, index, allMessages) => {
            try {
              return (
                // the last message should be highlighted
                <div
                  key={index}
                  className={`ge-top__narration__message ${index === allMessages.length - 1 ? "last-message" : ""}`}
                >
                  <div className="ge-top__narration__description">{JSON.parse(message.data).description}</div>
                  <div className="ge-top__narration__content">
                    {JSON.parse(message.data).content ? (
                      <div className="ge-top__narration__content">{JSON.parse(message.data).content} </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            } catch (e) {
              return "";
            }
          })
        : "NO EVENT YET"}
    </div>
  );
};

export default Narration;
