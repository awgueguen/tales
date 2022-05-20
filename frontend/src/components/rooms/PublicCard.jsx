import React from 'react'

const PublicCard = (props) => {
    const {title, description, img, participants, max_participants} = props
    const full = props?.full

  return (
    <>
     <div className={`${full? 'full-' : ''}public-card-wrapper`}>
        
        <div className='img-container'>
            <img src={img} className='public-card-img'/>
        </div>

        {description}
        {full ? 
          (<div className='full-room'>
            FULL
          </div>)
        : 
        <div className='number-players-in-room'>
          PLAYERS {participants.length} / {max_participants}
        </div>
        }
        {title}
      </div>
    </>
  )
}

export default PublicCard