import axios from "axios";
import React, { useEffect, useRef, useState, useContext } from "react";
import socketIOClient from "socket.io-client";
import AuthContext from '@context/AuthContext';

const EMIT_EVENT = "my_room_event";
const LISTENER_EVENT = "my_response";
const ENDPOINT = "http://localhost:8000";

const useChat = (roomId, nickname) => {
  // est-ce que ça a du sens de mettre la date ici ou de le mettre dans les socketEvent ???
  const { authTokens, userId} = useContext(AuthContext);
  const dateTranslator = (inputDate=false) => {

    let date = inputDate ? 
      new Date(inputDate).toUTCString().split('').slice(0, -4)
      : new Date().toUTCString().split('').slice(0, -4)
    date[18] = String(parseInt(date[18]) + 2)
    if (date[17] === '0' && date.join('').length > 25){
      date[17] = ''
    }
    return date.join('')

  }
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const [loadedMessage, setLoadedMessage] = useState()

  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);
    /**
     * fetch de la db pour charger les msg à mettre ici ?
     * Cette page se recharge à chaque fois qu'on change un charactere donc il faut fetch la dB
     * seulement quand on change de room/de joueurs ou qu'on a une déconnexion ?
     */
    socketRef.current.emit("join", {room: roomId, date: dateTranslator(), log: true});
    socketRef.current.on(LISTENER_EVENT, (message) => {
      /**
       * TODO: potentiellement n'afficher qu'une seule fois les logs ("connecté" / "rejoint la room x")
       * en utilisant log et en ayant un state compteur ?
       */
       
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.user_id === userId,
        isAdmin: message.is_admin,
      };
      if (incomingMessage.info) return
      setMessages((messages) => [...messages, incomingMessage]);
    });

    const request = axios.CancelToken.source()
       const fetch = async (method, url, changeState, data=null) => {
        await axios({
            url: url,
            method: method,
            data: data,
            headers: {Authorization: `Bearer ${authTokens.access}`},
            cancelToken: request.token,
        })
        .then ((response) => {
            changeState(response)
        })
        .catch((e) => console.log('error', e))
      }
    const url = `http://127.0.0.1:8000/api/room-${roomId}/messages`;
    
    const changeMessage = (response) => {
      for (let message of response.data.messages){
        console.log(message.createdAt)
        const incomingMessage = {
          data: message.messageContent,
          date: dateTranslator(message.createdAt),
          img: message.image,
          user_id: message.sender.id,
          user: message.sender.nickname,
          ownedByCurrentUser: message.sender.id === userId,
          isAdmin: message.is_admin,
        }
      setMessages((prev) => [...prev, incomingMessage])
    }
      // setMessages((messages) => [...messages, incomingMessage])
    }
    fetch('GET', url, changeMessage)
    // method, url, changeState, data?
    return () => {
      socketRef.current.disconnect();
      request.cancel();
    };
  }, [roomId, nickname]);

  const sendMessage = (messageBody, nickname, isAdmin) => {
    /* __________
        ajouter ici le record dans la db ?
    __________*/ 

      socketRef.current.emit(EMIT_EVENT, {
        data: messageBody,
        user_id: userId,
        user: nickname,
        is_admin: isAdmin,
        log: false,
        date: dateTranslator(),
        room: roomId
    });
  };

  return { messages, sendMessage };
};

export default useChat;
