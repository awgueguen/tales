import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

// const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const EMIT_EVENT = "my_room_event";
const LISTENER_EVENT = "my_response";
const ENDPOINT = "http://localhost:8000";

const useChat = (roomId, userId) => {
  // const useChat = (roomId, username) => {
  // est-ce que ça a du sens de mettre la date ici ou de le mettre dans les socketEvent ???

  let date = new Date().toUTCString().split('').slice(0, -3)
      date[18] = String(parseInt(date[18]) + 2)
      date = date.join('')

  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  useEffect(() => {
    
    socketRef.current = socketIOClient(ENDPOINT);
    socketRef.current.emit("join", {room: roomId, date: date,});
    socketRef.current.on(LISTENER_EVENT, (message) => {
      // console.log("message dans hook:", message);
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.user === userId
        // ownedByCurrentUser: message.user === nickname
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, userId]); //authTokens.access
// }, [roomId, username]); //authTokens.access

  const sendMessage = (messageBody) => {
    /* __________
        ajouter ici le record dans la db ?
    __________*/ 
      // c'est le retour de shlagman ...

      socketRef.current.emit(EMIT_EVENT, {
        data: messageBody,
        // user: username,
        user: userId,
        date: date,
        room: roomId
    });
  };

  return { messages, sendMessage };
};

export default useChat;
