import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
const ENDPOINT = "http://localhost:8000";

// dans ce sens l'endpoint devrait etre bon en revanche côté django
// pour l'instant on va chercher le static index.html .. 

// à voir demain

// ++ voir CORS (retrouver le tuto/explain qui va bien)

const ChatInput = (props) => {

  const [response, setResponse] = useState([]);
  const has_msg = (msg_content) => {
    return msg_content != '' && msg_content.trim()
  }
  // socket à mettre dans une ref
  const [socket, setSocket] = useState(null)
  // let socket = null;

  const init_listener = () => {
    console.log(socket)
    socket.on('connect', function () {
      console.log('connect')
      socket.emit('my_event', { data: 'I\'m connected! (client)' });
    });

    socket.on('disconnect', function () {
      // $('#log').append('<br>Disconnected');
      console.log('disconnected')
    });

    socket.on('my_response', function (msg) {
      console.log(msg)
      msg.data = has_msg(msg.data)
      // if (msg.count){
      //     $('#log').append(msg.count);
      // }
      if (msg.data) {
        // $('#log').append('<br>Received: ' + msg.data);
        console.log('msg:', msg.data)
      }
    });
  }

  useEffect(() => {
    if (socket) {

      init_listener()
      socket.on("my_response", data => {
        setResponse((prev) => ([
          ...prev,
          {
            time: new Date().toLocaleString('fr-FR'),
            msg: data
          }
        ]));
      });
      console.log(response)
      return () => socket.disconnect();
    }
  }, [socket])

  useEffect(() => {

    setSocket(io(ENDPOINT))
    // let socket = null;
    //return () => socket.disconnect();
  }, []);

  const [input, setInput] = useState('')
  // const id = props?.id || ''
  const handleChange = (e) => {
    setInput(e.target.value.trim())
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(`msg submitted: ${input}`)
    socket.emit('my_event', {data: input})
    setInput('')
  };

  return (
    <>
      <input
        type="text"
        name={props.inputName}
        // id={id}
        placeholder={props.inputName}
        onChange={handleChange}
        value={input}
      />
      {props.room ?
        (<input
          type="text"
          name={props.inputName}
          // id={id}
          placeholder={props.inputName}
          onChange={handleChange}
          value={input}
        />)
        :
        ('')
      }
      <button type='submit' onClick={handleSubmit}>
        {props.buttonName}
      </button>
      <ul>
        {
          response.map((data, index) => {
            <li key={index}>
              {data.date} -- {data.msg}
            </li>
          })
        }
      </ul>
    </>
  )
}

export default ChatInput;