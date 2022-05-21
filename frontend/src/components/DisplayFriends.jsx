/**
 * CLEANED CODE
 */
import { useState, useEffect } from "react";
import AddFriends from "./DisplayFriends/AddFriends";
import React, { useContext } from "react";
import AuthContext from "@context/AuthContext";
import axios from "axios";

/* //TODO ------------------------------------------------------------------ */
// map search bar -> show only what is searched

const DisplayFriends = (props) => {
  const URL = `http://127.0.0.1:8000/api/contacts/`;

  const [contacts, setContacts] = useState([]);
  let { authTokens } = useContext(AuthContext);

  useEffect(() => {
    axios({
      method: "GET",
      url: URL,
      headers: { Authorization: "Bearer " + authTokens.access },
    })
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <AddFriends contacts={contacts} setContacts={setContacts} />
      <ul>
        {contacts &&
          contacts.map((user, i) => (
            <li key={i}>
              <img src={user.profile_pic} alt="profile_pic" />
              <p>{user.nickname}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DisplayFriends;
