import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// import io from "socket.io-client";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:8000";


const ChatInput = (props) => {

  const [response, setResponse] = useState(['hello'])
  // useState([{time: new Date().toLocaleString('fr-FR'), msg: 'Hello'}]);
  const [users, setUsers]  = useState([])
  const has_msg = (msg_content) => {
    return msg_content != '' && msg_content.trim()
  }
  // const room = useLocation().pathname;
  const room = useParams().roomId
  const user = useLocation()?.state?.user || 'INVITE';

  console.log('room: ', room, 'user:', user)
  // const user = useLocation().state.
  const socket = useRef(null);
  // const [socket, setSocket] = useState(null)

  const init_listener = () => {
    console.log(socket.current, 'cucu')
    socket.current.on('connect', function () {
        console.log('connect')
        socket.current.emit('my_event', { data: 'I\'m connected! (client)' });
    });

    socket.current.on('disconnect', function () {
      console.log('disconnected')
    });
    socket.current.on("my_response", data => {
      console.log('data dans le my_response Client: ', data )
      setResponse((prev) => ([
        ...prev,
        {
          time: new Date().toLocaleString('fr-FR'),
          user: data?.user || '',
          msg: data.data
        }
        // data.data
      ]));
      console.log('coucou', response)
    });
  }

  useEffect(() => {

    if (socket.current === null) {
      socket.current = socketIOClient(ENDPOINT);

      socket.current.emit("join",{room: room});
      init_listener()
      // socket.current.on("my_response", data => {
      //   console.log('data dans le myresponse Client: ', data )
      //   setResponse((prev) => ([
      //     ...prev,
      //     // {
      //     //   time: new Date().toLocaleString('fr-FR'),
      //     //   msg: data
      //     // }
      //     data.data
      //   ]));
      //   console.log('coucou', response)
      // });
      // console.log({response})
    }
    return () => {
      // socket.current.emit("exit_chat", room);
      socket.current.disconnect();
    };
  }, [])

  // useEffect(() => {
  // }, []);

  const [input, setInput] = useState({message: '', tester: ''})
  // const id = props?.id || ''
  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value.trim()
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.current.emit('my_room_event', {data: input.message, user: user, room: room})
    setInput({
      ...input,
      message: ''
    })
  };

  const handleSubmitBis = (e) => {
    e.preventDefault()
    console.log(`msg envoyé à tlm: ${input.tester}`)
    socket.current.emit('my_broadcast_event', {data:input.tester})
    setInput({
      ...input,
      tester: ''
    })
  }

  return (
    <>
      <input
        type="text"
        name={props.inputName}
        // id={id}
        placeholder={props.inputName}
        onChange={handleChange}
        value={input.message}
      />
      {/* {props.room ?
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
      } */}
      <button type='submit' onClick={handleSubmit}>
        {props.buttonName}
      </button>
      <input
      type='text'
      name='tester'
      placeholder='tester'
      onChange={handleChange}
      value={input.tester}
      />
      <button type='submit' onClick={handleSubmitBis}>
        envoyer à tlm
      </button>
      <ul>
        {
          response.length > 0 &&
          response.map((data, index) => {
            return(
            <li key={index}>
              {data.user}
              {data.time}
              {data.msg}
            </li>
          )})
        }
      </ul>
      
    </>
  )
}

export default ChatInput;