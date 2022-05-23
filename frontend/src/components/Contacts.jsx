/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@context/AuthContext";
import axios from "axios";
/* mui --------------------------------------------------------------------- */
import CloseIcon from "@mui/icons-material/Close";
/* components -------------------------------------------------------------- */
import AddFriends from "./DisplayFriends/AddFriends";
import FriendCard from "./DisplayFriends/FriendCard";

const DisplayFriends = ({ contacts, handleToogle }) => {
  const URL = `http://127.0.0.1:8000/api/contacts/`;
  let { authTokens } = useContext(AuthContext);

  /* states ---------------------------------------------------------------- */
  const [add, toogleAdd] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    toogleAdd(!contactList.filter((user) => user.nickname.startsWith(e.target.value.toLocaleLowerCase())).length > 0);
    setInput(e.target.value);
  };

  /* lifecycle ------------------------------------------------------------- */
  useEffect(() => {
    if (contacts) {
      axios({
        method: "GET",
        url: URL,
        headers: { Authorization: "Bearer " + authTokens.access },
      })
        .then((response) => {
          setContactList(response.data);
        })
        .catch((error) => console.log(error));
    }

    // eslint-disable-next-line
  }, [contacts]);

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
        <AddFriends handleChange={handleChange} input={input} contactList={contactList} add={add} />
      </div>
      <div className="contacts__display">
        <ul>
          {contactList &&
            contactList
              .filter((user) => user.nickname.startsWith(input.toLocaleLowerCase()))
              .map((user, i) => (
                <li key={i}>
                  <FriendCard profilePic={user.profile_pic} nickname={user.nickname} />
                </li>
              ))}
        </ul>
      </div>
    </>
  );
};

export default DisplayFriends;
