import axios from "axios";
import { useEffect, useRef, useState, useContext } from "react";
import socketIOClient from "socket.io-client";
import AuthContext from "@context/AuthContext";

const EMIT_EVENT = "my_room_event";
const LISTENER_EVENT = "my_response";
const ENDPOINT = "http://localhost:8000";

const useChat = (roomId, nickname) => {
  const { authTokens, userId } = useContext(AuthContext);
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
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const init = useRef(true);
  // const [loadedMessage, setLoadedMessage] = useState()

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

    const request = axios.CancelToken.source();
    const fetch = async (method, url, changeState) => {
      await axios({
        url: url,
        method: method,
        headers: { Authorization: `Bearer ${authTokens.access}` },
        cancelToken: request.token,
      })
        .then((response) => {
          changeState(response);
        })
        .catch((e) => console.log("error", e));
    };
    const url = `http://127.0.0.1:8000/api/room-${roomId}/messages`;

    const changeMessage = (response) => {
      for (let message of response.data.messages) {
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
    };
    fetch("GET", url, changeMessage);
    return () => {
      socketRef.current.disconnect();
      request.cancel();
    };
    // eslint-disable-next-line
  }, [roomId, nickname]);

  const sendMessage = (messageBody, nickname, isAdmin) => {
    socketRef.current.emit(EMIT_EVENT, {
      data: messageBody,
      user_id: userId,
      user: nickname,
      is_admin: isAdmin,
      log: false,
      date: dateTranslator(),
      room: roomId,
    });

    const data = {
      sender: userId,
      room: roomId,
      messageContent: messageBody,
    };
    const isSuccesfullyPosted = (response) => {};
    const fetch = async (method, url, changeState, data) => {
      await axios({
        url: url,
        method: method,
        data: data,
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
        .then((response) => {
          changeState(response);
        })
        .catch((e) => console.log("error", e));
    };
    const url = `http://127.0.0.1:8000/api/room-${roomId}/messages/`;
    fetch("POST", url, isSuccesfullyPosted, data);
  };

  return { messages, sendMessage };
};

export default useChat;
