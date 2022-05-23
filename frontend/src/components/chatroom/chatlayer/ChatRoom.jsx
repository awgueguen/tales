import React from 'react'
import DisplayMsg from './DisplayMsg'
import ChatInput from './ChatInput'

const ChatRoom = (props) => {
  return (
    <div className='limite_composant'>
      <DisplayMsg messages={props.displayMsgProps}/>
      <ChatInput {...props.chatInputProps}/>
    </div>
  )
}

export default ChatRoom