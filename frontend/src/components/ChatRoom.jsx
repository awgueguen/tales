import React, { useState, useEffect} from 'react';
import ChatInput from './ChatInput';


const ChatRoom = (props) => {
    const channel = props?.channel
    const nick = props?.nick
    
    
    console.log('channel :', channel, 'nick:', nick)
  return (
    
    <>
        <ChatInput inputName='message' buttonName='Envoyer un msg'/>
    {/* id, inputName, room,  */}
    </>
  )
}

export default ChatRoom;