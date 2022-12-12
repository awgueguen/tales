import { useEffect, useRef, useState, useContext } from "react";
import socketIOClient from "socket.io-client";
import AuthContext from "@context/AuthContext";

import { getRoomMessages, postMessage } from '@services/messages/messages.services.js';

const EMIT_EVENT = "my_room_event";
const LISTENER_EVENT = "my_response";
const ENDPOINT = "http://localhost:8000";


const useChat = (roomId, nickname) => {

  const { authTokens, userId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const init = useRef(true);

  const dateTranslator = (inputDate = false) => {
    let date = inputDate
      ? new Date(inputDate).toUTCString().split("").slice(0, -4)
      : new Date().toUTCString().split("").slice(0, -4);
    date[18] = String(parseInt(date[18]) + 2);
    if (date[17] === "0" && date.join("").length > 25) {
      date[17] = "";
    }
    return date.join("");
  };
  
  useEffect(() => {
    if (init.current === true) {
      init.current = false;
      return;
    }
    socketRef.current = socketIOClient(ENDPOINT);

    socketRef.current.emit("join", {
      room: roomId,
      date: dateTranslator(),
      log: true,
    });
    socketRef.current.on(LISTENER_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.user_id === userId,
        is_admin: message.is_admin,
      };
      if (incomingMessage.info) return;
      setMessages((messages) => [incomingMessage, ...messages]);
    });

    getRoomMessages(authTokens.access, roomId)
      .then((response) => {
        for (let message of response.messages) {
          const incomingMessage = {
            data: message.messageContent,
            date: dateTranslator(message.createdAt),
            img: message.image,
            user_id: message.sender.id,
            user: message.sender.nickname,
            ownedByCurrentUser: message.sender.id === userId,
            isTriggered: message.isTriggered,
          };
          setMessages((prev) => [...prev, incomingMessage]);
        }
      })
      .catch((error) => console.log(error))
    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, [roomId, nickname, userId]);

  const sendMessage = async (messageBody, nickname, isAdmin) => {
    socketRef.current.emit(EMIT_EVENT, {
      data: messageBody,
      user_id: userId,
      user: nickname,
      is_admin: isAdmin,
      log: false,
      date: dateTranslator(),
      room: roomId,
    });

    const body = {
      sender: userId,
      room: roomId,
      messageContent: messageBody,
    };
  postMessage(authTokens.access, body)
    .then((response) => { console.log(response) })
    .catch((error) => console.log(error))
  }
  return [ messages, sendMessage ];
};

export default useChat;
