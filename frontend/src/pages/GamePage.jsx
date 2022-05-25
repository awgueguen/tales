/* components _____________________________________ */
import EventOn from '@chatroom/eventlayer/EventOn'
import HiStory from '@chatroom/infolayer/HiStory'
import CharacterDetail from '@chatroom/infolayer/CharacterDetail'
import ChatRoom from '@chatroom/chatlayer/ChatRoom'
import PlayersLayer from '@chatroom/playerslayer/PlayersLayer'
// import "@styles/ChatRoom.css";

/* external libraries _____________________________________ */
import React, { useState, useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import axios from 'axios';

/* utils_____________________________________ */
import useChat from "@hooks/useChat";
import useTrigger from "@hooks/useTrigger";
import AuthContext from "@context/AuthContext";


const GamePage = () => {
  const { authTokens, userId } = useContext(AuthContext);
  const roomId = useParams().roomId;
  const alreadyUser = useLocation()?.state?.alreadyUser;
  console.log(`dans ChatRoom - roomId: ${roomId}\nuserId: ${userId}\nalreadyUser${alreadyUser}`)

  const [newMessage, setNewMessage] = useState("");
  const [userDetail, setUserDetail] = useState({roompart: {nickname: 'waiting', isAdmin:'waiting'}})
  const [characterDetail, setCharacterDetail] = useState()
  const [playerList, setPlayerList] = useState()

  const { messages, sendMessage } = useChat(roomId, userDetail.roompart.nickname );
  const [checkTrigger, triggerCandidates, trigger, autocompletion] = useTrigger(authTokens.access, roomId);
  useEffect(() => {
    /**
     * componentMount
     * récupère les messages deja enregistrés, ici ou dans le on.connexion du useChat ??
     * 
     * TODO: 
     * -récupérer les events associés ?
     * -comprendre et faire fonctionner les triggers d'alex
     * 
     * -en arrivant dans la salle sans avoir de roomPart 
     * -> petit modal avec choix du personnage + choix du nickname
     * 
     * - Veiller à ne pas refetch la dB quand ce n'est pas nécessaire (no clue comment mais..)
     * -> il faut fetch la dB à la connexion du socket et pas ailleurs comme ça on est sûr
     * qu'on utilise le stat pour recharger les messages pendant la partie et pas tout les messages écrits
     * OU ALORS : on n'affiche que les messages d'une certaine date (cf mon papier)
     * afin de ne jamais fetch trop de messages et du coup c'est acceptable?
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
      // même chose ici ; il faudra veiller à donner le charactere.id
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
    console.log(`characterDetail: ${characterDetail}`)
  }, [characterDetail])

  useEffect( () => {
    console.log(`playerList: ${playerList}`)
  }, [playerList])

  const msgChange = (e) => {
    checkTrigger(e.target.value);
    setNewMessage(e.target.value);
  };

  const submitMessage = () => {
    /**
     * utilise le hook pour poster les message via socket
     * userId permet de retrouver plus simplement si l'utilisateur est ou non le proprio d'un msg
     */
    console.log(newMessage)
    console.log(userDetail.roompart)
    const {isAdmin, nickname} = userDetail.roompart
    sendMessage(newMessage, nickname, isAdmin);
    setNewMessage("");
  };


  const eventProps = {isEntity: true, event: {atk: 2, hp: 3, def: 4, img: null, title: 'la valé dlamor', description: 'ça fout les choquottes sa mère'}}
  // const {autocompletion, trigger, triggerCandidates, newMessage, msgChange, submitMessage} = props;
  const chatInputProps = {
    autocompletion: autocompletion,
    trigger: trigger,
    triggerCandidates: triggerCandidates,
    newMessage: newMessage,
    msgChange: msgChange,
    submitMessage: submitMessage,
  }
  /**
   * TODO: 
   */

  return (
  <>
    <div className='room-left-side'>
      <EventOn {...eventProps}/>
    </div>

    <div className='room-right-side'>
      <div className='room-right-side_top-half'>
        <HiStory />
        <CharacterDetail {...characterDetail} />
      </div>

      <div className='room-right-side_bottom-half'>
        <ChatRoom chatInputProps={chatInputProps} displayMsgProps={messages}/>

        <PlayersLayer players={playerList} userId={userId}/>
      </div>
      {/* _____room-right-side_bottom-half */}
    </div> 
    {/* _____room-right-side */}
  </>
  )
}

export default GamePage