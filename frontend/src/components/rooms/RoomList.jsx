import React, { useState, useEffect, useContext } from "react";
import AuthContext from "@context/AuthContext";
import axios from "axios";

import ModalRoom from "@components/Rooms/ModalRoom";
import PrivateCard from "@components/Rooms/PrivateCard";
import PublicCard from "@components/Rooms/PublicCard";
import { Link } from "react-router-dom";

/**
 * TODO :
 * adapter les Link (?)
 * associer les characters à l'id deja récup (useEffect l.52)
 *  quand on rejoint une room publique ouvrir un mini modèle pour personnaliser son chara/nickname... (mvp+)
 */

const RoomList = (props) => {
  const { authTokens, userId } = useContext(AuthContext);

  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
    return;
  };
  const [input, setInput] = useState({
    title: "",
    maxParticipants: "",
    description: "",
    img: "",
    invitations: [],
    story: { id: "", title: "" },
    ispublic: true,
  });
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

  const url_room_list = (userId) => `http://localhost:8000/api/room/${userId}/list/`;
  const [roomList, setRoomList] = useState();
  const url_pubic_rooms = "http://localhost:8000/api/room/publiclist/";
  const [publicList, setPublicList] = useState();

  useEffect(() => {
    // fetch toutes les rooms publiques
    const request = axios.CancelToken.source();
    const fetch = async () => {
      await axios({
        url: url_pubic_rooms,
        method: "GET",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        cancelToken: request.token,
      })
        .then((response) => {
          console.log(response);
          setPublicList(response.data);
        })
        .catch((e) => console.log("error", e));
    };

    fetch();

    return () => request.cancel();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    /**
     * fetch toutes les infos du joueurs (roomspart associés aux stories associées aux rooms)
     *
     * TODO: associer les characters à l'id deja récup
     */
    const request = axios.CancelToken.source();
    const fetch = async () => {
      await axios({
        url: url_room_list(userId),
        method: "GET",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        cancelToken: request.token,
      })
        .then((response) => {
          console.log(response);
          setRoomList(response.data);
        })
        .catch((e) => console.log("error", e));
    };

    fetch();

    return () => {
      request.cancel();
    };
    // eslint-disable-next-line
  }, [userId]);
  const [step, setStep] = useState(0);
  const backwardStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    console.log(roomList);
  }, [roomList]);

  useEffect(() => {
    console.log(publicList);
  }, [publicList]);

  return (
    <>
      {/* ______private-room-wrapper */}
      <div className="private-room-wrapper">
        <div className="existing-rooms">
          {roomList !== undefined &&
            roomList.map((r, index) => {
              return (
                <>
                  <Link
                    key={index}
                    className="private-card-link"
                    to={`/rooms/${r.id}`}
                    state={{ alreadyUser: true }}
                    // const userId = useLocation()?.state?.user || 'INVITE';
                  >
                    <PrivateCard isAdmin={r.isAdmin} img={r.room.story.image} title={r.room.story.title} />
                  </Link>
                </>
              );
            })}
        </div>

        <div className="create-room" onClick={handleModal}>
          {/**
           * background '+' en image?
           */}
          <div style={{ color: "red", fontSize: "20px" }}>+ Click here to show how to Add room</div>
        </div>
        {modal ? (
          <ModalRoom
            step={step}
            setStep={setStep}
            backwardStep={backwardStep}
            input={input}
            setInput={setInput}
            handleChange={handleChange}
          />
        ) : (
          ""
        )}
      </div>
      {/* ______ private-room-wrapper */}

      {/* ______ public-room-wrapper */}
      <div className="public-room-wrapper">
        {publicList !== undefined &&
          publicList.map((r, index) => {
            /* ici on return un lien si on peut rejoindre ou une div avec className si full pour la mettre en opacity inférieure en css ? */
            return (
              <>
                {r.participants.length === r.maxParticipants ? (
                  <div className="full-public-room" key={index}>
                    <PublicCard
                      title={r.story.title}
                      description={r.story.description}
                      img={r.story.image}
                      full={true}
                    />
                  </div>
                ) : (
                  <Link key={index} className="public-card-link" to={`/rooms/${r.id}`} state={{ alreadyUser: false }}>
                    <PublicCard
                      title={r.story.title}
                      description={r.story.description}
                      img={r.story.image}
                      participants={r.participants}
                      max_participants={r.maxParticipants}
                    />
                  </Link>
                )}
              </>
            );
          })}
      </div>
      {/* ______ public-room-wrapper */}
    </>
  );
};

export default RoomList;
