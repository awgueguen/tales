/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "@context/AuthContext";
import axios from "axios";

/* components -------------------------------------------------------------- */

import PublicRooms from "./Rooms/PublicRooms";
import InRooms from "./Rooms/InRooms";

const Rooms = (props) => {
  /* global ---------------------------------------------------------------- */
  const { authTokens, userId } = useContext(AuthContext);
  const URL_ROOM_IN = "http://localhost:8000/api/room/inroom_list/";
  const URL_PUBLIC_ROOM = "http://localhost:8000/api/room/public_list/";
  const URL_CREATE = "http://127.0.0.1:8000/api/room/create/";

  /* states ---------------------------------------------------------------- */
  const [inRoomList, setInRoomList] = useState();
  const [publicList, setPublicList] = useState();
  const navigate = useNavigate();

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
  const inputModel = {
    title: "",
    maxParticipants: "",
    description: "",
    invitations: [],
    story: { id: "", title: "", description: "", maxPlayers: "" },
    isPublic: false,
    step: 0,
  };
  const [modalInput, setModalInput] = useState(inputModel);

  const handleModal = () => {
    const modal = document.querySelector(".addroom__container");
    if (modal.hasAttribute("open")) {
      modal.close();
    } else {
      modal.showModal();
      if (modalInput.step === 0) {
        setModalInput({ ...modalInput, step: 1 });
      }
    }
  };

  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? e.target.checked : e.target.value;
    setModalInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { room: { ...modalInput, story: modalInput.story.id } };
    delete data.room.step;

    axios({
      url: URL_CREATE,
      method: "POST",
      data: { ...data },
      headers: { Authorization: `Bearer ${authTokens.access}` },
    })
      .then((response) => {
        navigate(`../rooms/${response.data.room.id}`, { state: { alreadyUser: true }, replace: true });
      })

      .catch((e) => console.log("error", e));
  };

  /* display --------------------------------------------------------------- */

  return (
    <div className="rooms">
      <InRooms
        rooms={inRoomList}
        handleModal={handleModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setModalInput={setModalInput}
        modalInput={modalInput}
      />
      <PublicRooms rooms={publicList} userId={userId} />
    </div>
  );
};

export default Rooms;
