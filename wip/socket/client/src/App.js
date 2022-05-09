import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
const socket = io.connect(`${ENDPOINT}`);

const App = () => {
  const [messages, setMessages] = useState(["Hello World"]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line
  }, [messages.length]);

  const getMessages = () => {
    socket.on("my_response", (data) => {
      setMessages([...messages, data]);
    });
  };

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const onClick = () => {
    if (message !== "") {
      socket.emit("my_message", message);
      setMessage("");
    }
  };

  return (
    <div>
      {messages.length > 0 &&
        messages.map((msg) => (
          <div>
            <p>{msg}</p>
          </div>
        ))}
      <input value={message} name="message" onChange={(e) => onChange(e)} />
      <button onClick={() => onClick()}>Send Messages</button>
    </div>
  );
};

export default App;
