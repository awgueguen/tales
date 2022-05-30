/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "@context/AuthContext";

/* components -------------------------------------------------------------- */
import FriendCard from "@components/Contacts/FriendCard";

/* mui --------------------------------------------------------------------- */
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CloseIcon from "@mui/icons-material/Close";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";

const AddRoom = (props) => {
  const { modalInput, handleChange, handleSubmit, setModalInput, handleModal } = props;
  const { step, story, description, title, maxParticipants, isPublic, invitations } = modalInput;

  const { authTokens } = useContext(AuthContext);
  const [stories, setStories] = useState();
  const [contacts, setContacts] = useState();

  const URL_STORIES = "http://localhost:8000/api/assets/stories/";
  const URL_CONTACTS = "http://localhost:8000/api/contacts/";

  /* lifecyle -------------------------------------------------------------- */

  useEffect(() => {
    const request = axios.CancelToken.source();

    const fetchModalData = async (url, setFunction) => {
      await axios({
        url,
        method: "GET",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        cancelToken: request.token,
      }).then((response) => setFunction(response.data));
    };

    if (step === 1) {
      fetchModalData(URL_STORIES, setStories);
    } else if (step === 3) {
      fetchModalData(URL_CONTACTS, setContacts);
    }

    return () => request.cancel();
  }, [step]);

  /* form handle ----------------------------------------------------------- */

  const handleSteps = () => {
    if (step !== 1) {
      setModalInput({ ...modalInput, step: step - 1 });
    }
  };

  const handleStorySelect = (id, title, description, maxPlayer) => {
    setModalInput((prevValue) => ({
      ...prevValue,
      story: { id: id, title: title, description: description, maxPlayers: maxPlayer },
      title: "",
      description: "",
      maxParticipants: "",
      step: 2,
    }));
  };

  const handleCustomDetails = () => {
    setModalInput({
      ...modalInput,
      title: title ? title : story.title,
      description: description ? description : story.description,
      maxParticipants: maxParticipants
        ? isNaN(maxParticipants)
          ? story.maxPlayers
          : maxParticipants
        : story.maxPlayers,
      step: 3,
    });
  };

  const handleAddFriends = (id, nickname) => {
    if (invitations.some((invitation) => invitation.id == id)) {
      let newInvitations = invitations.filter((invitation) => invitation.id !== id);
      setModalInput((prevValue) => ({ ...prevValue, invitations: newInvitations }));
    } else if (invitations.length >= maxParticipants - 1) {
      alert("maximun number of participants reached"); // ! TODO
    } else {
      let newInvitations = [...invitations, { id: id, nickname: nickname }];
      setModalInput((prevValue) => ({ ...prevValue, invitations: newInvitations }));
    }
  };

  const formSteps = () => {
    switch (step) {
      case 1:
        return (
          <div className="addroom__stories">
            {stories
              ? stories.map((story, id) => (
                  <button
                    key={id}
                    className="btn-story"
                    onClick={() => handleStorySelect(story.id, story.title, story.description, story.optimalPlayers)}
                  >
                    <div className="btn-story__image">
                      <img src={story.image} alt={story.title} />
                    </div>
                    <div className="btn-story__details">
                      <div className="btn-story__header">
                        <h4>{story.title}</h4>
                        <h5>2 - {story.optimalPlayers} players</h5>
                      </div>
                      <div className="btn-story__description">
                        <p>{story.description}</p>
                      </div>
                    </div>
                  </button>
                ))
              : "Loading..."}
          </div>
        );
      case 2:
        return (
          <>
            <div className="addroom__input">
              <div className="addroom__input-field">
                <input
                  value={title}
                  name="title"
                  type="text"
                  placeholder={"Default title: " + story.title}
                  className="input-default"
                  onChange={handleChange}
                />
                <span className="icon__edit"></span>
              </div>
              <div className="addroom__input-field">
                <input
                  value={maxParticipants}
                  name="maxParticipants"
                  type="number"
                  placeholder={"Default max players: " + story.maxPlayers + " (number)"}
                  className="input-default"
                  onChange={handleChange}
                />
                <span className="icon__edit"></span>
              </div>
              <div className="addroom__input-field">
                <textarea
                  value={description}
                  rows="4"
                  name="description"
                  placeholder={"Default description: " + story.description}
                  className="input-default"
                  onChange={handleChange}
                />
                <span className="icon__edit"></span>
              </div>

              <label className="input-checkbox">
                <input value={isPublic} name="isPublic" type="checkbox" onChange={handleChange} />
                Do you want to make the room public ?
              </label>
            </div>
            <button className="btn-secondary" onClick={handleCustomDetails}>
              <h4>ADD PLAYERS </h4>
              <AddReactionOutlinedIcon />
            </button>
          </>
        );
      case 3:
        return (
          <>
            <div className="addroom__invitations">
              {invitations
                ? invitations.map((contact, id) => (
                    <button
                      className="btn-text-only"
                      key={id}
                      onClick={() => handleAddFriends(contact.id, contact.nickname)}
                    >
                      + {contact.nickname}
                    </button>
                  ))
                : ""}
            </div>
            <div className="addroom__friends">
              {contacts
                ? contacts.map((contact, id) => (
                    <button
                      key={id}
                      onClick={() => handleAddFriends(contact.id, contact.nickname)}
                      className={`btn-friend ${invitations.some((i) => i.id === contact.id) ? "selected" : ""}`}
                    >
                      <FriendCard
                        profilePic={contact.profile_pic}
                        nickname={contact.nickname}
                        username={contact.username}
                        full={true}
                      />
                      <span className="icon__selected"></span>
                    </button>
                  ))
                : "Loading..."}
            </div>

            <button className="btn-primary" onClick={handleSubmit}>
              CREATE ROOM
            </button>
          </>
        );
      default:
        return "Loading..";
    }
  };

  /* interactions ---------------------------------------------------------- */
  return (
    <dialog className="addroom__container">
      <div>
        <div className="addroom__header">
          <button className={`btn-back ${step === 1 ? "inactive" : ""}`} onClick={handleSteps}>
            <KeyboardBackspaceIcon />
          </button>
          <div className={`addroom__progression step-${step === 1 ? "one" : step === 2 ? "two" : "three"}`}></div>
          <button className="btn-close" onClick={handleModal}>
            <CloseIcon className="btn-close__icon" />
          </button>
        </div>
        <div className="addroom__title">
          <h4>{step === 1 ? "Select a story" : step === 2 ? "Customize your Room" : "Add Players"}</h4>
          <h5>Story: {story.title} </h5>
        </div>
      </div>
      {formSteps()}
    </dialog>
  );
};

export default AddRoom;
