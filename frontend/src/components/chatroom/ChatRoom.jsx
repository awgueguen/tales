import React, { useState, useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router";
// import "@styles/ChatRoom.css";
import useChat from "@hooks/useChat";
import useTrigger from "@hooks/useTrigger";

import AuthContext from "@context/AuthContext";

import axios from 'axios';

const ChatRoom = (props) => {

  const { authTokens, userId } = useContext(AuthContext);
  const roomId = useParams().roomId;
  const alreadyUser = useLocation()?.state?.alreadyUser;
  console.log(`dans ChatRoom - roomId: ${roomId}\nuserId: ${userId}\nalreadyUser${alreadyUser}`)

  const [checkTrigger, triggerCandidates, trigger, autocompletion] = useTrigger(authTokens.access, roomId);
  const [newMessage, setNewMessage] = useState("");
  const [userDetail, setUserDetail] = useState({roompart: {nickname: 'waiting'}})
  const { messages, sendMessage } = useChat(roomId, userDetail.roompart.nickname );
  const [characterDetail, setCharacterDetail] = useState()
  const [playerList, setPlayerList] = useState()
  useEffect(() => {
    /**
     * componentMount
     * if User.isAdmin -> layer_dm else  -> layer_randy
     * récupère les messages deja enregistrés, ici ou dans le on.connexion du useChat ??
     * 
     * TODO: récupérer les events associés ?
     * comprendre et faire fonctionner les triggers d'alex
     * en arrivant dans la salle sans avoir de roomPart 
     * -> petit modal avec choix du personnage + choix du nickname
     */
    const request = axios.CancelToken.source()
    const url = `http://127.0.0.1:8000/api/roompart/create/${roomId}`
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

  if (alreadyUser === false){
    // arrivée dans une room publique donc pas encore de roomPart
    const data = {
      room: roomId,
      user: userId,
      isAdmin: false,
      // nickname: "test", 
      /* il faudra mettre une valeur de formulaire
       pour l'instant on laisse la valeur par defaut (user.nickname*/
      character: 1,
      // même chose ici ; il faudra veilleur à donner le charactere.id
    }

    fetch('POST', url, (response) => setUserDetail(response.data), data)
  }
  else if(alreadyUser){
    // rejoint une room existante avec un personnage deja crée
    fetch('GET', url, (response) => setUserDetail(response.data))
  }
  else{
  // alreadyUser == undefined -> il s'agit du cas où on join via l'url ou d'une erreur
    console.log('might be an error')
  }
  fetch('GET', `http://127.0.0.1:8000/api/roompart/list/${roomId}`, (response) => setPlayerList(response.data))
  return () => request.cancel()
//eslint-disable-next-line
}, []) 

useEffect(() => {
  console.log(userDetail)
  if (userDetail.roompart.nickname === 'waiting') return
  const {name, atk, hp, defense, weapon} = userDetail.roompart.character.characterClass
  const {isAdmin, nickname} = userDetail.roompart
  setCharacterDetail({
    isAdmin: isAdmin,
    nickname: nickname,
    class: name,
    weapon: 'rusty yet spiky dagger',
    // weapon: weapon,
    stats: {
      hp: hp,
      atk: atk,
      def: defense},
  })
}, [userDetail])

  useEffect( () => {
    console.log(characterDetail)
  }, [characterDetail])

  useEffect( () => {
    console.log(playerList)
  }, [playerList])

  const msgChange = (e) => {
    checkTrigger(e.target.value);
    setNewMessage(e.target.value);
  };

  const submitMessage = () => {
    /**
     * utilise le hook pour poster les message via socket
     * POST les msg dans la dB, minimum info : date, content, nick, room
     */
    const {nickname} = characterDetail;
    sendMessage(newMessage, nickname);
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
              <p className='sending-date'>
                {message.date}
              </p>
              {message.user} : 
              {message.data}
            </li>
          ))}
        </ol>
      </div>
      <div id="search_container">
        <div id="autocomplete">{autocompletion ? autocompletion : null}</div>
        <input
          value={newMessage}
          onChange={msgChange}
          placeholder="Write message..."
          className="new-message-input-field"
        />
      </div>
      <button onClick={submitMessage} className="send-message-button">
        Send
      </button>
      <p>
        Trigger: {trigger ? trigger["trigger"] : null} - {autocompletion ? autocompletion : null}
      </p>
      <ul>
        {triggerCandidates?.map((candidate) => (
          <li>
            {candidate["trigger"]} : {candidate["title"] ? candidate["title"] : candidate["name"]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoom;
