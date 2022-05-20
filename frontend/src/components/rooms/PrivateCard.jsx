import React from 'react'

const PrivateCard = (props) => {
    const {isAdmin, img, title} = props

  return (
    <>
      <div className='private-card-wrapper'>
        {isAdmin ? 
        <div className='master-banner'>
            DUNGEON MASTER
        </div>
        : ''
        }
        <div className='img-container'>
            <img src={img} className='private-card-img'/>
        </div>
        {title}
      </div>
    </>
  )
}

export default PrivateCard