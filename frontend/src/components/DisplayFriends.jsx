import React from "react";
import { useState } from "react";
// imorter tout



const DisplayFriends = () => {
  const [contacts, setContacts] = useState([]);

  // user/<int:user_id>/contacts

  React.useEffect(() => {
    const apiUrlUsers = "user/1/contacts";
    fetch(apiUrlUsers)
      .then(response => response.json())
      .then((data) => {console.log(data, 'data')
        setContacts(data.contacts); })
      .catch(error => console.log(error));
  }, []);


  return (
<ul>   
{contacts.map((user, i) => (
              <li key={i}>
                <img src={user.profile_pic} alt="profile_pic" />
                <p>{user.nickname}</p>
                </li>))}
</ul>   
    );
};


export default DisplayFriends;
