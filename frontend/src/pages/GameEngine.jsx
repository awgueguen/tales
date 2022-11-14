/* global ------------------------------------------------------------------ */
import React, { useState, useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import AuthContext from "@context/AuthContext";

/* hooks ------------------------------------------------------------------- */
import useChat from "@hooks/useChat";
import useTrigger from "@hooks/useTrigger";
import axios from "axios";

/* components -------------------------------------------------------------- */
// import PlayersLayer from "@components/GameEngine/PlayersLayer";
import ChatLayer from "@components/GameEngine/ChatLayer";
import InfosLayer from "@components/GameEngine/InfosLayer";
import EventLayer from "@components/GameEngine/EventLayer";

/* render ------------------------------------------------------------------ */

const GameEngine = () => {
  const [participants, setParticipants] = useState();
  const [userDetail, setUserDetail] = useState({ roompart: { nickname: "waiting", isAdmin: "waiting" } }); // ?
  const [myCharacter, setMyCharacter] = useState();
  const [newMessage, setNewMessage] = useState("");

  const { userId, authTokens } = useContext(AuthContext);
  const { roomId } = useParams();

  const URL_PARTICIPANTS = `http://127.0.0.1:8000/api/roompart/list/${roomId}`;
  const URL_TRIGGERS = "http://127.0.0.1:8000/api/triggers/submit/";

  /* lifecycle ------------------------------------------------------------- */
  const { messages, sendMessage } = useChat(roomId, userDetail.roompart.nickname); // ?
  const [lastEvent, setLastEvent] = useState();
  const [chatMessages, setChatMessages] = useState();
  const [triggerMessages, setTriggerMessages] = useState();

  useEffect(() => {
    const request = axios.CancelToken.source();
    const fetchAllParticipants = async () => {
      await axios({
        url: URL_PARTICIPANTS,
        method: "GET",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        cancelToken: request.token,
      })
        .then((response) => {
          const roomParticipant = response.data.find((user) => user.user === userId);

          setParticipants(response.data);
          setMyCharacter(roomParticipant.character);
          setUserDetail({ roompart: { nickname: roomParticipant.nickname, isAdmin: roomParticipant.isAdmin } });
        })
        .catch((e) => console.log("error", e));
    };

    fetchAllParticipants();
  }, []);

  useEffect(() => {
    setChatMessages(messages.filter((message) => !message.isTriggered));
    setTriggerMessages(messages.filter((message) => message.isTriggered));
  }, [messages.length]);

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
  }, [triggerMessages]);

  /* chat handle ----------------------------------------------------------- */
  const [checkTrigger, triggerCandidates, trigger, reset] = useTrigger(
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
      axios({
        url: URL_TRIGGERS,
        method: "POST",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        data: { ...trigger, roomId },
      });
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
