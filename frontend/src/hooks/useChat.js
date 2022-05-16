import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

// const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const EMIT_EVENT = "my_room_event";
const LISTENER_EVENT = "my_response";
const ENDPOINT = "http://localhost:8000";

const useChat = (roomId, userId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  // console.log("room dans hook", roomId);
  // console.log("userId dans hook", userId);
  useEffect(() => {
    // socketRef.current = socketIOClient(SOCKET_SERVER_URL,
    socketRef.current = socketIOClient(
      ENDPOINT
      //   ,{query: { roomId },
    );

    // socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
    socketRef.current.emit("join", { room: roomId });
    socketRef.current.on(LISTENER_EVENT, (message) => {
      // console.log("message dans hook:", message);
      const incomingMessage = {
        ...message,
        /* ICI ON N'A TOUT LE TRUC ENVOYE PAR LE SOCKET
        A REVOIR */
        // ownedByCurrentUser: message.senderId === socketRef.current.id,
        ownedByCurrentUser: message.user === userId,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    // return () => {
    //   socketRef.current.disconnect();
    // };
  }, [roomId]);

  const sendMessage = (messageBody) => {
    /* __________
        ajouter ici le record dans la db ?
    __________*/

    // socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
    socketRef.current.emit(EMIT_EVENT, {
      data: messageBody,
      //   senderId: socketRef.current.id,
      user: userId,
      room: roomId,
    });
  };

  return { messages, sendMessage };
};

export default useChat;
