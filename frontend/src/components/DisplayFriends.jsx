import React from "react";
import { useState, useEffect } from "react";
import AddFriends from "./AddFriends";
// imorter tout



const DisplayFriends = () => {
  const [contacts, setContacts] = useState([]);

  // user/<int:user_id>/contacts

  useEffect(() => {
    const apiUrlUsers = "http://localhost:8000/user/2/contacts";
    fetch(apiUrlUsers)
      .then(response => response.json())
      .then((data) => {console.log(data, 'data')
        setContacts(data.contacts); })
      .catch(error => console.log(error));
  }, []);


  return (
<div>
  <AddFriends contacts={contacts} />
  <ul>   
  {contacts.map((user, i) => (
                <li key={i}>
                  <img src={user.profile_pic} alt="profile_pic" />
                  <p>{user.nickname}</p>
                  </li>))}
  </ul>  
</div>

    );
};


export default DisplayFriends;
