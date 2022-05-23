import React from 'react'
import StatBox from '@chatroom/eventlayer/StatBox';

const EventOn = (props) => {
  const {isEntity, event} = props
  const {atk, hp, def, img, title, description} = event

  const stats = {'hp': hp, 'atk': atk, 'def': def}
  /* pas très modulable.. à revoir si on a du temps */
  
  return (
    <div className='limite_composant'>
      EventOn
      {isEntity &&
      <>
        {Object.keys(stats).map((stat) => {
            return(
              <StatBox name={stat} stat={stats[stat]}/> 
              )})}
      </>
      }

      <div className='event-img'>
        <img src={img} alt='representation of the event'/>
        {/* constuire le alt autrement mais comment.. ?*/}
      </div>
      <div className='event-text-box'>
        <div className='event-title'>
          {title}
        </div>
        <div className='event-description'>
          {description}
        </div>
      </div>
    </div>
  )
}

export default EventOn