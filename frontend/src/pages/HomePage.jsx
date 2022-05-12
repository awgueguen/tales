import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "@context/AuthContext";

const HomePage = () => {
  let [characters, setCharacters] = useState([]);
  let { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    getCharacters();
    // eslint-disable-next-line
  }, []);

  let getCharacters = async () => {
    await axios({
      url: "http://127.0.0.1:8000/api/characters/",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.access}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setCharacters(response.data.characters);
      } else if (response.statusText === "Unauthorized") {
        logoutUser();
      }
    });
  };

  return (
    <div>
      <p>You are logged to the homepage</p>
      <ul>
        {characters.map((character, i) => (
          <li key={i}>{character.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
