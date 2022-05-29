import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "@context/AuthContext";

/* components -------------------------------------------------------------- */
import CharacterCard from "@components/RoomAccess/CharacterCard";

const RoomAccess = () => {
  /* states ---------------------------------------------------------------- */
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState();
  const [participants, setParticipants] = useState();
  const [characters, setCharacters] = useState();
  const [character, setCharacter] = useState();
  const [put, setPut] = useState();

  const { userId, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const URL_ROOM = `http://127.0.0.1:8000/api/room-${roomId}`;
  const URL_PARTICIPANTS = `http://127.0.0.1:8000/api/roompart/list/${roomId}`;
  const URL_CHARACTERS = `http://127.0.0.1:8000/api/characters/`;
  const URL_ADD_PARTICIPANT = `http://127.0.0.1:8000/api/roompart/create/`;
  /* lifecylce ------------------------------------------------------------- */

  useEffect(() => {
    // setLoading(true);
    const request = axios.CancelToken.source();
    const connectAPI = async (url, setFunction) => {
      await axios({
        url,
        method: "GET",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        cancelToken: request.token,
      })
        .then((response) => {
          setFunction(response.data);
        })
        .catch((e) => {
          if (e.response.status === 404) {
            navigate("/");
          }
          console.log("error", e);
        });
    };

    connectAPI(URL_ROOM, setRoom);
    connectAPI(URL_PARTICIPANTS, setParticipants);

    return () => request.cancel();
  }, [roomId]);

  useEffect(() => {
    const request = axios.CancelToken.source();

    if (participants && room) {
      if (participants.some((participant) => participant.user === userId)) {
        const userParticipant = participants.find((participant) => participant.user === userId);
        if (userParticipant.character || userParticipant.isAdmin) {
          setLoading(false);
        } else {
          setPut(userParticipant.id);
        }
      } else if (!room.isPublic || room.isClosed || participants.length >= room.maxParticipants) {
        navigate("/");
      }
      axios({
        url: URL_CHARACTERS,
        method: "GET",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        cancelToken: request.token,
      })
        .then((response) => {
          setCharacters(response.data);
        })
        .catch((e) => console.log("error", e));
    }

    return () => request.cancel();
  }, [participants, room]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (character) {
      await axios({
        url: URL_ADD_PARTICIPANT,
        method: put ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        data: put
          ? { put, update: { nickname: character.name, character: character.id } }
          : { room: roomId, user: userId, character: character },
      })
        .then(() => setLoading(false))
        .catch((e) => console.log("error", e));
    }
  };

  /* results --------------------------------------------------------------- */
  return loading ? (
    room && participants && characters ? (
      <div className="duat">
        <div className="duat__title">
          <h4>CHOOSE YOUR CHARACTER</h4>{" "}
          <button className={`btn-text-only ${character ? "" : "disable"}`} onClick={handleSubmit}>
            ENTER ROOM AS : {character ? character.name : ""}
          </button>
        </div>
        <div className="duat__container">
          <div className="duat__cards">
            {characters
              ? characters.map((c, index) => (
                  <CharacterCard key={index} {...c} character={character} setCharacter={setCharacter} />
                ))
              : "Loading..."}
          </div>
        </div>
      </div>
    ) : (
      "Loading..."
    )
  ) : (
    <Outlet />
  );
};

export default RoomAccess;
