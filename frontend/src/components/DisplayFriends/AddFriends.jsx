/**
 * CLEANED CODE
 */
import React, { useContext, useState } from "react";
/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";
import axios from "axios";

const AddFriends = (props) => {
  let { authTokens } = useContext(AuthContext);

  const URL = "http://127.0.0.1:8000/api/contacts/add/";
  const [input, setInput] = useState([]);
  const [information, setInformation] = useState();
  const message = {
    alreadyFriends: "You are already friends with this user",
    added: "You have added this user",
    notFound: "User can not be found",
    error: "An error has occured",
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  /**
   * Check if the input is already a friend.
   * @returns {boolean}
   */
  const compareFriends = () => {
    const friends = props.contacts;
    return friends?.some(({ username }) => username.toLowerCase() === input.toLowerCase());
  };

  /**
   * Check if the input exist in the db.
   * @returns {Promise}
   */
  const checkContactExistence = async () => {
    const request = await axios({
      method: "GET",
      url: `${URL}?receiver=${input}`,
      headers: { Authorization: "Bearer " + authTokens.access },
    }).catch((error) => error.response);

    return request.statusText !== "Not Found";
  };

  /**
   * Add a new contact entry to the db.
   * @param {string} input
   */
  const addFriendToContact = async (input) => {
    const request = await axios({
      method: "POST",
      url: URL,
      headers: { Authorization: "Bearer " + authTokens.access },
      data: { receiver: input },
    }).catch((error) => error);

    return request.statusText === "Created";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let contact_exist = await checkContactExistence();
    let contact_in_list = compareFriends();

    if (contact_exist && !contact_in_list) {
      const request = await addFriendToContact(input);
      if (request) {
        setInformation(message.added);
      } else {
        setInformation(message.error);
      }
    } else if (compareFriends(input) === true) {
      setInformation(message.alreadyFriends);
    } else {
      setInformation(message.notFound);
    }
  };

  return (
    <div>
      <form action="submit" onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Search Player" onChange={handleChange} />
        <span>{information}</span>
      </form>
      <span></span>
    </div>
  );
};

export default AddFriends;
