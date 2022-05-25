import React from 'react'

const PlayerIcon = (props) => {
  console.log(props)
  const {nickname, id, index} = props
  // const img = props.character.image
  /**
   * TODO : ajouter un Link pour afficher le détail de l'utilisateur
   */
  return (
    <li key={index}>
      <div className='gameroom-playercard'>
        player {index}
        {/* <img src={img} /> */}
        {/* alt='image du personnage' */}
        <p>{nickname}</p>
      </div>
    </li>
  )
}

export default PlayerIcon