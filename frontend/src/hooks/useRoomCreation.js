/**
 * TODO -> put all steps in a switch function might be cleaner / clearer
 *  extract states in a reducer
 */

import {useState, useEffect, useContext} from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '@context/AuthContext';
/* services ---------------------------------------------------- */
import { getContacts } from '@services/contacts/contacts.services';
import { getStories } from '@services/stories/stories.services';
import { createRoom } from '@services/rooms/rooms.services.js';

const useRoomCreation = (handleLeftSeatModal) => {
    const [stories, setStories] = useState();
    const [contacts, setContacts] = useState();
    const [leftSeats, setLeftSeats] = useState();
    const { authTokens } = useContext(AuthContext);

    const navigate = useNavigate();

    const inputModel = {
        title: "",
        maxParticipants: "",
        description: "",
        invitations: [],
        story: { id: "", title: "", description: "", maxPlayers: "" },
        isPublic: false,
        step: 1,
      };

    const [modalInput, setModalInput] = useState(inputModel);
    
    useEffect(() => {
        const maxPlayers = isNaN(modalInput.maxParticipants) ?
          modalInput.story.maxPlayers
          : modalInput.maxParticipants
        setLeftSeats(maxPlayers - (modalInput.invitations.length + 1))
    }, [modalInput.story.maxPlayers, modalInput.maxParticipants, modalInput.invitations])

    useEffect(() => {
        console.log(modalInput.step, "mmh??")
        if (modalInput.step === 1) {
          getStories(authTokens.access)
            .then((response) => setStories(response))
            .catch((error) => console.log(error))
    
        } else if (modalInput.step === 3) {
          getContacts(authTokens.access)
            .then((response) => setContacts(response))
            .catch((error) => console.log(error))
        }
      }, [modalInput.step, authTokens.access]);
    
    useEffect( () => {
        // TODO -> record invitations in localstorage, and only reset the list when we validate the fact that we want less players that the actual invitation list
        // else retrieve invitations within localstorage
        if (modalInput.maxParticipants === "") return
        if (modalInput.invitations.length > modalInput.maxParticipants) {
            setModalInput({...modalInput,
                invitations: []})
        }
    // eslint-disable-next-line
    }, [modalInput.maxParticipants])

    const handleModalChange = (e) => {
        const { name, type } = e.target;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setModalInput((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        const data = { room: { 
            ...modalInput,
            story: 3,
            maxParticipants: modalInput.maxParticipants,
        } };
        delete data.room.step;
        console.log(data, "data dans le submit")
        createRoom(authTokens.access, data)
          .then((response) => {
            // comment rendre le navigate variable ? mettre l'url d'où on appelle la fonction en param du hook ?
            navigate(`../rooms/${response}`, { state: { alreadyUser: true }, replace: true });
          })
          .catch((error) => console.log(error));
    }

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

    const handleCustomDetails = () => {
        setModalInput({
            ...modalInput,
            title: modalInput.title ? modalInput.title : modalInput.story.title,
            description: modalInput.description ? modalInput.description : modalInput.story.description,
            maxParticipants: modalInput.maxParticipants
            ? isNaN(modalInput.maxParticipants)
                ? modalInput.story.maxPlayers
                : modalInput.maxParticipants
            : modalInput.story.maxPlayers,
            step: 3,
        });
    };

    const handleAddFriends = (id, nickname) => {
        // Case 1: contact already selected.
        if (modalInput.invitations.some((invitation) => invitation.id === id)) {
          let newInvitations = modalInput.invitations.filter((invitation) => invitation.id !== id);
          setModalInput((prevValue) => ({ ...prevValue, invitations: newInvitations }));
          setLeftSeats(leftSeats + 1);
        }
        // Case 2: contact limit reached.
        else if (modalInput.invitations.length >= modalInput.maxParticipants - 1) {
          // TODO : Add pick a nickname
          handleLeftSeatModal(false, "no-left-seat")
        }
        // Case 3: contact added to the invitation list
        else {
          let newInvitations = [...modalInput.invitations, { id: id, nickname: nickname }];
          setModalInput((prevValue) => ({
            ...prevValue,
            invitations: newInvitations
          }));
          setLeftSeats(leftSeats - 1);
        }
      };
    const createRoomStates = {
        stories,
        contacts,
        leftSeats,
        modalInput,
    };

    return [
        createRoomStates,
        setModalInput,
        handleAddFriends,
        handleStorySelect,
        handleCustomDetails,
        handleModalChange,
        handleModalSubmit
    ]
}

export default useRoomCreation;