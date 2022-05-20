import React, {useState, useContext, useEffect} from "react";
// import { useParams } from "react-router";
import { useLocation, useParams } from "react-router";
import "@styles/chatroom.css";
import useChat from "@hooks/useChat";
import AuthContext from "@context/AuthContext";

import axios from 'axios';

const ChatRoom = () => {

  const { authTokens, userId} = useContext(AuthContext);
  const roomId  = useParams().roomId;
  const alreadyUser = useLocation()?.state?.alreadyUser;
  console.log(`dans ChatRoom - roomId: ${roomId}\nuserId: ${userId}\nalreadyUser${alreadyUser}`)
  const { messages, sendMessage } = useChat(roomId, userId);
  const [newMessage, setNewMessage] = useState("");
  const [userDetail, setUserDetail] = useState()
  useEffect(() => {
    /**
     * componentMount
     * if !alreadyUser POST roomPart else GET roomPart
     * Get User(user_id)
     * if User.isAdmin -> layer_dm else  -> layer_randy
     * récupère les messages deja enregistrés, ici ou dans le on.connexion du useChat ??
     * 
     * TODO: récupérer les events associés ?
     * comprendre et faire fonctionner les triggers d'alex
     */
    const request = axios.CancelToken.source()

    // const changeStoryState = (response) => {
    //     setStories(response.data.stories)
    //     setInput({...input, story: {id: 1, title: response.data.stories[0].title}})
    // }
    // const changeFriendsState = (response) => {
    //     setFriends(response.data.user_contact)
    // }

    const fetch = async (method, url, changeState, data=null) => {
        await axios({
            url: url,
            method: method,
            headers: {Authorization: `Bearer ${authTokens.access}`},
            cancelToken: request.token,
        })
        .then ((response) => {
            changeState(response)
        })
        .catch((e) => console.log('error', e))
    }
  if (alreadyUser){

  }
  else{

  }
  return () => request.cancel()
//eslint-disable-next-line
}, []) 

useEffect(() => {
  console.log(userDetail)
}, [userDetail])

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };
  const handleSendMessage = () => {
    /**
     * utilise le hook pour poster les message via socket
     * POST les msg dans la dB, minimum info : date, content, nick, room
     */
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
              <p className='sending-date'>
                {message.date}
              </p>
              {message.user} : 
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
