/**
 * * CLEAN CODE
 * SERVICES ADDED
 */
/* global ------------------------------------------------------------------ */
import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@context/AuthContext";
/* mui --------------------------------------------------------------------- */
import CloseIcon from "@mui/icons-material/Close";
/* components -------------------------------------------------------------- */
import AddFriends from "./Contacts/AddFriends";
import FriendCard from "./Contacts/FriendCard";

/* services -------------------------------------------------------------- */
import { getContacts } from "@services/contacts/contacts.services";

const DisplayFriends = ({ contacts, handleToogle }) => {
  let { authTokens } = useContext(AuthContext);

  /* states ---------------------------------------------------------------- */
  const [add, toggleAdd] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [input, setInput] = useState("");

  const resetInput = () => {
    toggleAdd(false);
    setInput("");
    getContacts(authTokens.access)
    .then((response) => setContactList(response))
    .catch((error) => console.log(error));

  }
  const handleChange = (e) => {
    toggleAdd(!contactList.filter((user) => user.nickname.startsWith(e.target.value.toLocaleLowerCase())).length > 0);
    setInput(e.target.value);
  };

  /* lifecycle ------------------------------------------------------------- */
  useEffect(() => {

    if (contacts) {
      getContacts(authTokens.access)
        .then((response) => setContactList(response))
        .catch((error) => console.log(error));
    }

  }, [contacts, authTokens.access]);

  /* export ---------------------------------------------------------------- */
  return (
    <>
      <div className="contacts__header">
        <h5>Contacts</h5>
        <button className="btn-close" onClick={handleToogle}>
          <CloseIcon className="btn-close__icon" />
        </button>
      </div>
      <div>
        <AddFriends 
          handleChange={handleChange}
          input={input}
          contactList={contactList}
          add={add} 
          resetInput={resetInput}
        />
      </div>
      <div className="contacts__display">
        <ul>
          {contactList &&
            contactList
              .filter((user) => user.nickname.startsWith(input.toLocaleLowerCase()))
              .map((user, i) => (
                <li key={i}>
                  <FriendCard profilePic={user.profile_pic} nickname={user.nickname} username={user.username} />
                </li>
              ))}
        </ul>
      </div>
    </>
  );
};

export default DisplayFriends;
