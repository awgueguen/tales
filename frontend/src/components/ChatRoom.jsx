import React, { useState, useContext } from "react";
import { useLocation, useParams } from "react-router";
import "@styles/chatroom.css";
import useChat from "@hooks/useChat";
import useTrigger from "@hooks/useTrigger";

import AuthContext from "@context/AuthContext";

// décomposer en sous composants ?

const ChatRoom = () => {
  const { authTokens, username, userId } = useContext(AuthContext);
  const accessToken = authTokens.access;

  const roomId = useParams().roomId;
  // const userId = useLocation()?.state?.user || "INVITE";
  // console.log(`dans ChatRoom - roomId: ${roomId} - userId: ${username}`);
  const [checkTrigger] = useTrigger(accessToken, roomId);
  const { messages, sendMessage } = useChat(roomId, userId);
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessageChange = (event) => {
    checkTrigger(event.target.value);
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-room-container">
      <h1 className="room-name">Room: {roomId}</h1>
      <div className="messages-container">
        <ol className="messages-list">
          {messages.map((message, i) => (
            <li key={i} className={`message-item ${message.ownedByCurrentUser ? "my-message" : "received-message"}`}>
              {message.data}
            </li>
          ))}
        </ol>
      </div>
      <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Write message..."
        className="new-message-input-field"
      />
      <button onClick={handleSendMessage} className="send-message-button">
        Send
      </button>
    </div>
  );
};

export default ChatRoom;
