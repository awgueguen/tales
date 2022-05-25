import React from 'react'

const FriendCard = (props) => {

    const { img, nickname, minsize} = props // + id ?
  return (
    <>
    <div className={`friend-card-container ${minsize? 'min-size' : ''}`}>
        <img className='thumb-friend-img' src={img} alt={`${nickname} img`}/>
        <p className='friend-name'>{nickname}</p>
    </div>
    </>
  )
}

export default FriendCard