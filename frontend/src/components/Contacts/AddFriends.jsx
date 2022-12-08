/**
 * TODO -> switch contact exist / already friend check with useEffect[input]
 * and do lazy loading (if a result does match, store it in matchresult and do not refetch while the search query does not diverge from the matchresult)
 */


import React, { useContext, useState, useEffect } from "react";
/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";
import axios from "axios";
/* services ---------------------------------------------------------------- */
import { addContact, checkContactExists} from "@services/contacts/contacts.services";

const AddFriends = ({ input, handleChange, contactList, add }) => {
  let { authTokens } = useContext(AuthContext);

  const URL = "http://127.0.0.1:8000/api/contacts/add/";
  const [error, setError] = useState();
  const [valid, setValid] = useState();
  const [contactExist, setContactExist] = useState(false)
  const [newContact, setNewContact] = useState(false)
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

  const compareFriends = () => {
    const friends = contactList;
    return friends?.some(({ username }) => username.toLowerCase() === input.toLowerCase());
  };

  useEffect(()=> {
    checkContactExists(authTokens.access, input)
      .then((response) => {
        console.log(response, "contactCheck")
        setContactExist(response.statusTest !== "Not Found")
      })
      .catch((error) => console.log(error));
  }, [authTokens.access, input])
  
  // const checkContactExistence = async () => {
  //   // const request = await axios({
  //   //   method: "GET",
  //   //   url: `${URL}?receiver=${input}`,
  //   //   headers: { Authorization: "Bearer " + authTokens.access },
  //   // }).catch((error) => error.response);
  //   // console.log('friendrequest response', request)
  //   // return request.statusText !== "Not Found";
  //   checkContactExists(authTokens.access, input)
  //     .then((response) => {
  //       console.log(response, "contactCheck")
  //       setContactExist(response.statusTest !== "Not Found")
  //     })
  //     .catch((error) => console.log(error));
  // };

  const addFriendToContact = async (input) => {
    // const request = await axios({
    //   method: "POST",
    //   url: URL,
    //   headers: { Authorization: "Bearer " + authTokens.access },
    //   data: { receiver: input },
    // }).catch((error) => error);

    // return request.statusText === "Created";
    let hello;
    const test = await addContact(authTokens.access, {"receiver": input})
      .then((response) => {
        console.log(response, "contactadd")
        setNewContact(response.statusText === "Created")
        hello = response.statusText === "Created"
      })
      .catch((error) => console.log(error));
    return hello;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (add) {
      // let contact_exist = await checkContactExistence();
      let contact_in_list = compareFriends();
      if (contactExist && !contact_in_list) {
        const request = await addFriendToContact(input);
        if (request) {
          setValid("Invitiation sent !");
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
