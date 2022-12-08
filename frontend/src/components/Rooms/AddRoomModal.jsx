/**
 * * CLEAN CODE
 * SERVICES ADDED
 */
/* global ------------------------------------------------------------------ */
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "@context/AuthContext";

/* components -------------------------------------------------------------- */
import FriendCard from "@components/Contacts/FriendCard";
import NoLeftSeatModal from "./NoLeftSeatModal";
/* mui --------------------------------------------------------------------- */
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CloseIcon from "@mui/icons-material/Close";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";

/* services -------------------------------------------------------------- */
import { getContacts } from '@services/contacts/contacts.services';
import { getStories } from '@services/stories/stories.services';

const AddRoom = (props) => {
  const { modalInput, handleChange, handleSubmit, setModalInput, handleModal } = props;
  const { step, story, description, title, maxParticipants, isPublic, invitations } = modalInput;
  const { authTokens } = useContext(AuthContext);
  const [stories, setStories] = useState();
  const [contacts, setContacts] = useState();
  const [leftSeats, setLeftSeats] = useState();
  /* lifecyle -------------------------------------------------------------- */


  useEffect(() => {
    setLeftSeats(parseInt(maxParticipants, 10) - 1)
  }, [maxParticipants])
  /**
   * Fetch at each steps the availables assets according to the present step.
   */
  useEffect(() => {
    if (step === 1) {

      getStories(authTokens.access)
      .then((response) => setStories(response))
      .catch((error) => console.log(error))

    } else if (step === 3) {

      getContacts(authTokens.access)
        .then((response) => setContacts(response))
        .catch((error) => console.log(error))
    }

    // return () => request.cancel();
  }, [step, authTokens.access]);

  /* form handle ----------------------------------------------------------- */

  /**
   * Update the step number.
   */
  const handleSteps = () => {
    if (step !== 1) {
      setModalInput({ ...modalInput, step: step - 1 });
    }
  };

  /**
   * Handle the differents input for the story editing.
   */
  const handleStorySelect = (id, title, description, maxPlayer) => {
    setModalInput((prevValue) => ({
      ...prevValue,
      story: { 
        id: id,
        title: title,
        description: description,
        maxPlayers: maxPlayer
      },
      title: "",
      description: "",
      maxParticipants: "",
      step: 2,
    }));
  };

  /**
   * Check if the user has edited some of the original story's informations.
   */
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

  /**
   * Handle the selection of one or multiple friends to a room.
   */
  const handleLeftSeatModal = (e, modalName) => {
    const modal = document.querySelector(`.${modalName}-modal__container`);
    if (!e){
      modal.showModal();
    }
    else {
      e.preventDefault();

      if (modal.hasAttribute("open")) {
        modal.close();
      } else {
        modal.showModal();
      }
    }
  };
  const handleAddFriends = (id, nickname) => {
    // Case 1: contact already selected.
    if (invitations.some((invitation) => invitation.id === id)) {
      let newInvitations = invitations.filter((invitation) => invitation.id !== id);
      setModalInput((prevValue) => ({ ...prevValue, invitations: newInvitations }));
      setLeftSeats(leftSeats + 1);
    }
    // Case 2: contact limit reached.
    else if (invitations.length >= maxParticipants - 1) {
      // TODO : Change notification system to UI
      // TODO : Show number of seat available (DONE with poor UI)
      // TODO : Add pick a nickname
      // alert("maximun number of participants reached");
      handleLeftSeatModal(false, "no-left-seat")
    }
    // Case 3: contact added to the invitation list
    else {
      let newInvitations = [...invitations, { id: id, nickname: nickname }];
      setModalInput((prevValue) => ({
        ...prevValue,
        invitations: newInvitations
      }));
      setLeftSeats(leftSeats - 1);
    }
  };

  const formSteps = () => {
    switch (step) {
      case 1:
        // story selection.
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
        // Story details editing.
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
        // Friends invitation step
        return (
          <>
            <div className="addroom__invitations">
              { leftSeats !== 0 ?
                <p>{leftSeats} seat(s) left</p>
                : <p style={{color: "red"}}>NO LEFT SEAT</p>
              }
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
            <NoLeftSeatModal handleModal={handleLeftSeatModal}/>

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
      {/* Call each different steps to populate the modal */}
      {formSteps()}
    </dialog>
  );
};

export default AddRoom;
