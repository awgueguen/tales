import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/* tests ------------------------------------------------------------------- */
import socketIOClient from "socket.io-client";
/* end --------------------------------------------------------------------- */

const ENDPOINT = "http://localhost:8000";

export default function Room() {
  const [messages, setMessages] = useState(["Hello World"]);
  const [message, setMessage] = useState("");
  const room = useLocation().pathname;

  /* tests ----------------------------------------------------------------- */
  const socket = useRef(null);

  useEffect(() => {
    if (socket.current === null) {
      socket.current = socketIOClient(ENDPOINT);

      socket.current.emit("begin_chat", room);
    }

    socket.current.on("my_response", (data) => {
      console.log({ data });
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      // socket.current.emit("exit_chat", room);
      socket.current.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  /* end ------------------------------------------------------------------- */

  const onClick = () => {
    if (message !== "") {
      socket.current.emit("my_message", { message, room });
      setMessage("");
    }
  };

  const onChange = (e) => {
    setMessage(e.target.value);
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
}
