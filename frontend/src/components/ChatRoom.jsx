import React, {useState, useContext} from "react";
import { useParams } from "react-router";
// import { useLocation, useParams } from "react-router";
import "@styles/chatroom.css";
import useChat from "@hooks/useChat";
import AuthContext from "@context/AuthContext";

const ChatRoom = () => {

  const { authTokens, userId } = useContext(AuthContext);
  const roomId  = useParams().roomId;
  // const userId = useLocation()?.state?.user || 'INVITE';
  console.log(`dans ChatRoom - roomId: ${roomId} - userId: ${userId}`)
  const { messages, sendMessage } = useChat(roomId, userId);
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessageChange = (event) => {
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
            <li
              key={i}
              className={`message-item ${
                message.ownedByCurrentUser ? "my-message" : "received-message"
              }`}
            >
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
