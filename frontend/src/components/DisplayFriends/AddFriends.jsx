/**
 * * CLEAN CODE
 */
import React, { useContext, useState, useEffect } from "react";
/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";
import axios from "axios";

const AddFriends = ({ input, handleChange, contactList, add }) => {
  let { authTokens } = useContext(AuthContext);

  const URL = "http://127.0.0.1:8000/api/contacts/add/";
  const [error, setError] = useState();
  const [valid, setValid] = useState();
  const message = {
    alreadyFriends: "You are already friends with this user",
    notFound: "User can not be found",
    error: "An error has occured",
  };

  /* lifecycle ------------------------------------------------------------- */
  useEffect(() => {
    setError("");
    setValid("");
  }, [input]);
  /* methods --------------------------------------------------------------- */

  /**
   * Check if the input is already a friend.
   * @returns {boolean}
   */
  const compareFriends = () => {
    const friends = contactList;
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
    if (add) {
      let contact_exist = await checkContactExistence();
      let contact_in_list = compareFriends();
      if (contact_exist && !contact_in_list) {
        const request = await addFriendToContact(input);
        if (request) {
          setValid("Friend added !");
        } else {
          setError(message.error);
        }
      } else if (compareFriends(input) === true) {
        setError(message.alreadyFriends);
      } else {
        setError(message.notFound);
      }
    }
  };

  return (
    <>
      <form name="contact" onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Search, Add.." onChange={handleChange} value={input} />
        <input type="submit" hidden />
      </form>
      {contactList.filter((user) => user.nickname.startsWith(input.toLocaleLowerCase())).length > 0 ? (
        ""
      ) : (
        <ul onClick={handleSubmit}>
          <li className="contacts__add">
            {input.length > 14 ? input.substring(0, 14) + "..." : input}{" "}
            <span className={`icon__add-friend ${error ? "error" : valid ? "valid" : ""}`}></span>
          </li>
          <span className={valid || error ? "contacts__add-label" : ""}>{valid ? valid : error}</span>
        </ul>
      )}
    </>
  );
};

export default AddFriends;
