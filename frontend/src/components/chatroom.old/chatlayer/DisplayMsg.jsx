import React from 'react'

const DisplayMsg = (props) => {
  console.log(props)
  const {messages} = props
  console.log(messages)
  return (
    <div className='limite_composant'>
      DisplayMsg

      <div className="messages-container">
        <ol className="messages-list">
          {messages && messages.map((message, i) => (
            <li
              key={i}
              className={`message-item
              ${message.ownedByCurrentUser ? "my-message" : "received-message"}
              ${message.is_admin ? "admin-message" : ""}
                `}
            > 
              <p className='sending-date'>
                {message.date}
              </p>
              {message.user} : 
              {message.data}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default DisplayMsg