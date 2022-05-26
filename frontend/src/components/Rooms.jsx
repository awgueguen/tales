/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "@context/AuthContext";
import axios from "axios";

/* components -------------------------------------------------------------- */

import PublicRooms from "./Dashboard/PublicRooms";
import InRooms from "./Dashboard/InRooms";

/**
 * TODO :
 * adapter les Link (?)
 * associer les characters à l'id deja récup (useEffect l.52)
 *  quand on rejoint une room publique ouvrir un mini modèle pour personnaliser son chara/nickname... (mvp+)
 */

const Rooms = (props) => {
  /* global ---------------------------------------------------------------- */
  const { authTokens, userId } = useContext(AuthContext);
  const URL_ROOM_IN = "http://localhost:8000/api/room/inroom_list/";
  const URL_PUBLIC_ROOM = "http://localhost:8000/api/room/public_list/";

  /* states ---------------------------------------------------------------- */
  const [inRoomList, setInRoomList] = useState();
  const [publicList, setPublicList] = useState();

  /* lifecycle ------------------------------------------------------------- */
  useEffect(function fetchPublicRooms() {
    const request = axios.CancelToken.source();
    const fetch = async () => {
      await axios({
        url: URL_PUBLIC_ROOM,
        method: "GET",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        cancelToken: request.token,
      })
        .then((response) => {
          setPublicList(response.data);
        })
        .catch((e) => console.log("error", e));
    };

    fetch();

    return () => request.cancel();
    //eslint-disable-next-line
  }, []);

  useEffect(function fetchRoomParticipants() {
    const request = axios.CancelToken.source();
    const fetch = async () => {
      await axios({
        url: URL_ROOM_IN,
        method: "GET",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        cancelToken: request.token,
      })
        .then((response) => {
          setInRoomList(response.data);
        })
        .catch((e) => console.log("error", e));
    };

    fetch();

    return () => request.cancel();
    // eslint-disable-next-line
  }, []);

  /* modal ----------------------------------------------------------------- */
  const [modal, setModal] = useState(false);

  const handleModal = () => {
    setModal(!modal);
  };

  const handleChange = (e) => {
    const { name, type } = e.target;
    // const file = e.target?.files
    const value = type === "checkbox" ? e.target.checked : e.target.value;
    // if (name === "story"){
    //     setInput({...input, story: stories.filter((s) => s.id === value)[0]})
    //     return
    // }
    setInput((prevState) => ({
      ...prevState,
      //   ...(e.target.type === 'file' && {'files': e.target.files}), // pour ajoùter une img
      [name]: value,
    }));
  };

  const inputModel = {
    title: "",
    maxParticipants: "",
    story_description: "",
    invitations: [],
    story: { id: "", title: "" },
    isPublic: true,
  };

  const [input, setInput] = useState({ inputModel });

  const [step, setStep] = useState(0);
  const backwardStep = () => {
    setStep(step - 1);
  };
  /* make one */

  /* display --------------------------------------------------------------- */

  return (
    <div className="rooms">
      <InRooms rooms={inRoomList} />
      <PublicRooms rooms={publicList} userId={userId}/>
    </div>
  );
};

export default Rooms;
