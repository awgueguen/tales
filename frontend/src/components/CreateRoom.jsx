// import React, {useState, useEffect} from 'react'

// const CreateRoom = () => {
//     const [input, setInput] = useState('')
//   return (
//     <>
//         <input
//             value={input}
//             type={text}
//             onChange={handleChange}
//             placeholder='type room name'
//         >

//         </input>
//     </>
//   )
// }

// export default CreateRoom

import React, {useState} from "react";
import { Link } from "react-router-dom";

//import "./Home.css";"
import "@styles/createroom.css"

const CreateRoom = () => {
  const [input, setInput] = useState({roomName: '', userName: ''});
  //userName à switch quand on ajoutera l'utilisateur

  const handleChange = (e) => {
    setInput((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  return (
    <div className="home-container">
        
      <input
        type="text"
        name='roomName'
        placeholder="Room"
        value={input.roomName}
        onChange={handleChange}
        className="text-input-field"
      />
      <input
        type="text"
        name='userName'
        placeholder="Choose a nickname"
        value={input.userName}
        onChange={handleChange}
        className="text-input-field"
      />
      <Link
      to={`/rooms/${input.roomName}`}
      state = {{user : input.userName}}
      className="enter-room-button"
      >
        Create room
      </Link>
    </div>
  );
};

export default CreateRoom;