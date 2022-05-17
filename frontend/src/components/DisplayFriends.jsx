import { useState, useEffect } from "react";
import AddFriends from "./AddFriends";
import React, { useContext } from "react";
import AuthContext from "@context/AuthContext";
import axios from "axios";

// imorter tout



const DisplayFriends = (props) => {
  const [contacts, setContacts] = useState([]);
  let { userId, authTokens } = useContext(AuthContext);


  // user/<int:user_id>/contacts

  useEffect(  () => {
    const apiUrlUser = `http://127.0.0.1:8000/api/user/${userId}/contacts/`;
    axios({
      method: 'GET',
      url: apiUrlUser,
      // headers: { Authorization: 'Bearer ' + authTokens.access }
  })
  // http://127.0.0.1:8000/api/user/username/
  // http://127.0.0.1:8000/api/user/userId/contacts
    .then((data) => {console.log(data.data.contacts, 'data')
        setContacts(data.data.contacts)} 
       )
      .catch(error => console.log(error));
  }, []);


  return (
<div>
   <AddFriends contacts={contacts} /> 
  <ul>   
  {contacts && contacts.map((user, i) => (
                <li key={i}>
                  <img src={user.profile_pic} alt="profile_pic" />
                  <p>{user.nickname}</p>
                  </li>))}
  </ul>  
</div>

    );
};


export default DisplayFriends;
