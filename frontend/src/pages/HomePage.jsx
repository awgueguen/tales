import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "@context/AuthContext";

const HomePage = () => {
  let [characters, setCharacters] = useState([]);
  let { authTokens } = useContext(AuthContext);

  useEffect(() => {
    getCharacters();
  }, []);

  let getCharacters = async () => {
    console.log(authTokens);
    let res = await axios.get({
      url: "http://127.0.0.1:8000/api/classes/",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    console.log(res);
  };

  return (
    <div>
      <p>You are logged to the homepage</p>
      <ul>
        {characters.map((character, i) => (
          <li id={i}>{character.body}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
