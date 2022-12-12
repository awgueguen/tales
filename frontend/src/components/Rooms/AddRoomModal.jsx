/**
 * * CLEAN CODE
 * SERVICES ADDED
 */
/* global ------------------------------------------------------------------ */
import useRoomCreation from "@hooks/useRoomCreation";
/* components -------------------------------------------------------------- */
import FriendCard from "@components/Contacts/FriendCard";
import NoLeftSeatModal from "./NoLeftSeatModal";
/* mui --------------------------------------------------------------------- */
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CloseIcon from "@mui/icons-material/Close";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";

/* services -------------------------------------------------------------- */
// import { getContacts } from '@services/contacts/contacts.services';
// import { getStories } from '@services/stories/stories.services';

const AddRoom = ({handleModal}) => {

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
  const [
    createRoomStates,
    setModalInput,
    handleAddFriends,
    handleStorySelect,
    handleCustomDetails,
    handleModalChange,
    handleModalSubmit
  ] = useRoomCreation(handleLeftSeatModal);

  const {stories, contacts, leftSeats, modalInput} = createRoomStates;
  const { step, story, description, title, maxParticipants, isPublic, invitations } = modalInput;

  /* lifecyle -------------------------------------------------------------- */


  /* form handle ----------------------------------------------------------- */

  /**
   * Update the step number.
   */
  const handleBackwardStep = () => {
    if (step !== 1) {
      setModalInput({ ...modalInput, step: step - 1 });
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
                  onChange={handleModalChange}
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
                  onChange={handleModalChange}
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
                  onChange={handleModalChange}
                />
                <span className="icon__edit"></span>
              </div>

              <label className="input-checkbox">
                <input value={isPublic} name="isPublic" type="checkbox" onChange={handleModalChange} />
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

            <button className="btn-primary" onClick={handleModalSubmit}>
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
          <button className={`btn-back ${step === 1 ? "inactive" : ""}`} onClick={handleBackwardStep}>
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
