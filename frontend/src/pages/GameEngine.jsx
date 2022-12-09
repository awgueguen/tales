/* global ------------------------------------------------------------------ */
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import AuthContext from "@context/AuthContext";

/* hooks ------------------------------------------------------------------- */
import useChat from "@hooks/useChat";
import useTrigger from "@hooks/useTrigger";

/* components -------------------------------------------------------------- */
// import PlayersLayer from "@components/GameEngine/PlayersLayer";
import ChatLayer from "@components/GameEngine/ChatLayer";
import InfosLayer from "@components/GameEngine/InfosLayer";
import EventLayer from "@components/GameEngine/EventLayer";

/* services ---------------------------------------------------------------- */
import {submitTriggers} from '@services/triggers/triggers.services.js';
import {getRoomParticipants} from '@services/roomparts/roomparts.services.js';
/* render ------------------------------------------------------------------ */

const GameEngine = () => {
  // const [participants, setParticipants] = useState();
  const [userDetail, setUserDetail] = useState({ roompart: { nickname: "waiting", isAdmin: "waiting" } }); // ?
  const [myCharacter, setMyCharacter] = useState();
  const [newMessage, setNewMessage] = useState("");

  const { userId, authTokens } = useContext(AuthContext);
  const { roomId } = useParams();

  /* lifecycle ------------------------------------------------------------- */
  const { messages, sendMessage } = useChat(roomId, userDetail.roompart.nickname); // ?
  const [lastEvent, setLastEvent] = useState();
  const [chatMessages, setChatMessages] = useState();
  const [triggerMessages, setTriggerMessages] = useState();

  useEffect(() => {
    
    getRoomParticipants(authTokens.access, roomId)
      .then((response) => {
        const roomParticipant = response
          .find((user) => user.user === userId);
        setMyCharacter(roomParticipant.character);
        setUserDetail({ "roompart": {
          "nickname": roomParticipant.nickname,
          "isAdmin": roomParticipant.isAdmin 
        }});
      })
      .catch((error) => console.log(error));

  }, [authTokens.access, roomId, userId]);

  useEffect(() => {
    setChatMessages(messages.filter((message) => !message.isTriggered));
    setTriggerMessages(messages.filter((message) => message.isTriggered));
    // eslint-disable-next-line
  }, [messages.length]);
  // pourquoi length et pas messages ?

  useEffect(() => {
    if (triggerMessages) {
      const lastEvent = triggerMessages[0];
      try {
        setLastEvent(JSON.parse(lastEvent.data));
        // const allMessages = triggerMessages.shift();
        // setTriggerMessages(allMessages);
      } catch (e) {
        // console.log(e);
      }
    }
    // eslint-disable-next-line
  }, [triggerMessages]);

  /* chat handle ----------------------------------------------------------- */
  const [checkTrigger, triggerCandidates, trigger] = useTrigger(
    // ^ reset
    authTokens.access,
    roomId,
    userDetail.roompart.isAdmin
  );

  const msgChange = (e) => {
    checkTrigger(e.target.value);
    setNewMessage(e.target.value);
  };

  const submitMessage = (e) => {
    e.preventDefault();
    const { isAdmin, nickname } = userDetail.roompart;
    sendMessage(newMessage, nickname, isAdmin);
    setNewMessage("");
    submitTrigger();
  };

  const submitTrigger = () => {
    if (trigger) {
      // axios({
      //   url: URL_TRIGGERS,
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${authTokens.access}` },
      //   data: { ...trigger, roomId },
      // });
      submitTriggers(authTokens.access, {...trigger, roomId})
        .then((response) => console.log('trigger submitted', response))
        .catch((error) => console.log('error submitting trigger', error))
    }
  };

  const chatInputProps = {
    trigger: trigger,
    triggerCandidates: triggerCandidates,
    newMessage: newMessage,
    msgChange: msgChange,
    submitMessage: submitMessage,
  };

  /* render ---------------------------------------------------------------- */
  return (
    <div id="game-engine">
      <div className="game-engine__left-container">
        <EventLayer lastEvent={lastEvent} />
        {/* <pre>{JSON.stringify(triggerCandidates, null, 2)}</pre>
        <pre>{JSON.stringify(trigger, null, 2)}</pre> */}
      </div>
      <div className="game-engine__top-container">
        <InfosLayer messages={triggerMessages} character={myCharacter} lastEvent={lastEvent} />
      </div>
      <div className="game-engine__center-container">
        <ChatLayer messages={chatMessages} handleInput={chatInputProps} />
      </div>
      {/* <div className="game-engine__right-container">
        <PlayersLayer participants={participants} />
      </div> */}
    </div>
  );
};

export default GameEngine;
