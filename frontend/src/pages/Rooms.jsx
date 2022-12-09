/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "@context/AuthContext";
import axios from "axios";

/* components -------------------------------------------------------------- */
import PublicRooms from "@components/Rooms/PublicRooms";
import InRooms from "@components/Rooms/InRooms";

/* services ---------------------------------------------------------------- */
import { getUserRooms } from "@services/rooms/rooms.services";
import { createRoom } from "@services/rooms/rooms.services";

const Rooms = (props) => {
  /* global ---------------------------------------------------------------- */
  const { authTokens, userId } = useContext(AuthContext);
  const URL_CREATE = "http://127.0.0.1:8000/api/room/create/";
  // const URL_ROOMS = "http://localhost:8000/api/room/homepage";

  /* states ---------------------------------------------------------------- */
  const [roomsIn, setRoomsIn] = useState([]);
  const [roomsPublic, setRoomsPublic] = useState([]);
  const navigate = useNavigate();

  /* lifecycle ------------------------------------------------------------- */

  useEffect(function fetchRooms() {
    // const request = axios.CancelToken.source();

    getUserRooms(authTokens.access)
      .then((response) => {
        setRoomsIn([]);
        setRoomsPublic([]);

        response.forEach((room) => {
          if (room.participants.some((e) => e.user.id === userId)) {
            setRoomsIn((prevValue) => [...prevValue, room]);
          } else if (room.isPublic) {
            setRoomsPublic((prevValue) => [...prevValue, room]);
          }
        });
      })
      .catch((error) => {
        if (error.response.status === 500) {
          console.log("Not Connected");
        }
      })
    // const connectAPI = async (url) => {
    //   await axios({
    //     url,
    //     method: "GET",
    //     headers: { Authorization: `Bearer ${authTokens.access}` },
    //     cancelToken: request.token,
    //   })
    //     .then((response) => {
    //       setRoomsIn([]);
    //       setRoomsPublic([]);

    //       response.data.forEach((room) => {
    //         if (room.participants.some((e) => e.user.id === userId)) {
    //           setRoomsIn((prevValue) => [...prevValue, room]);
    //         } else if (room.isPublic) {
    //           setRoomsPublic((prevValue) => [...prevValue, room]);
    //         }
    //       });
    //     })
    //     .catch((e) => {
    //       if (e.response.status === 500) {
    //         console.log("Not Connected");
    //       }
    //     });
    // };

    // connectAPI(URL_ROOMS);

    // return () => request.cancel();
    // eslint-disable-next-line
  }, []);

  /* room creation --------------------------------------------------------- */

  // template for the room creation
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

  // handle the modal process
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

  // handle all the toogle elements of the modal
  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? e.target.checked : e.target.value;
    setModalInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handle the submit part and create the link with the backend
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { room: { ...modalInput, story: modalInput.story.id } };
    delete data.room.step;

    createRoom(authTokens.access, data)
      .then((response) => {
        navigate(`../rooms/${response.data}`, { state: { alreadyUser: true }, replace: true });
      })
      .catch((error) => console.log(error));
    }
  //   axios({
  //     url: URL_CREATE,
  //     method: "POST",
  //     data: { ...data },
  //     headers: { Authorization: `Bearer ${authTokens.access}` },
  //   })
  //     .then((response) => {
  //       navigate(`../rooms/${response.data}`, { state: { alreadyUser: true }, replace: true });
  //     })
  //     .catch((e) => console.log("error", e));
  // };

  /* display --------------------------------------------------------------- */

  return (
    <div className="rooms">
      <InRooms
        userId={userId}
        rooms={roomsIn}
        handleModal={handleModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setModalInput={setModalInput}
        modalInput={modalInput}
      />
      <PublicRooms rooms={roomsPublic} userId={userId} />
    </div>
  );
};

export default Rooms;
