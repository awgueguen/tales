import React from 'react'

const StatBox = (props) => {
    const {stat, name} = props
  return (
    <div className={`entity-event-${stat}-detail`}> 
        <div className={`entity-event-${stat}-name`}>
            {name}
        </div>
        <div className={`entity-event-${stat}-value`}>
            {stat}
        </div>
    </div>
  )
}

export default StatBox