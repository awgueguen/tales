import React from "react";
import { useState } from "react";
import { useEffect } from "react";



const DisplayFriends = () => {
  const [request, setRequest] = useState("");

  React.useEffect(() => {
    const apiUrlUsers = "http://localhost:8000/user/1";
    fetch(apiUrlUsers)
      .then(response => response.json())
      .then((data) => console.log(data))
      .catch(error => console.log(error));
  }, []);

//   const handleChange = (e) => {
//     setRequest(e.target.value);
//   };
//  console.log(MyUserItems)
//   return (
// <ul>   
// {MyUserItems.map((user, i) => (
//               <li key={i}>
//                 <img src={user.profile_pic} alt="profile_pic" />
//                 <p>{user.nickname}</p>
//                 </li>))}
// </ul>   
//     );
// };
}

export default DisplayFriends;
