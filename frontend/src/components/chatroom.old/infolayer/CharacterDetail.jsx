import React from 'react'

const CharacterDetail = (props) => {
  /**
   * TODO : ajouter la src de l'img DM
   * :hover class -> détail de la classe ?
   */
  const {isAdmin, nickname, class:characterClass, weapon, stats} = props
  const {hp, atk, def} = stats || 'loading'
  console.log(props)
  return (
    <div className='limite_composant'>
    {isAdmin?
    <div className='dm-status'>
      <img src='' alt='icon of a book, representating that the DM is telling the story'/>
    </div>
      :
    <div className='regular-player-status'>
      <p className='detail-nickname'>{nickname}</p>
      <div className='class-detail'>
        <p>Class: {characterClass}</p>
        <p>Weapon: {weapon}</p>
      </div>
      <div className='character-stats'>
        <p>HP: {hp}</p>
        <p>ATK: {atk}</p>
        <p>DEF: {def}</p>
      </div>
    </div>
    }
    </div>
  )
}

export default CharacterDetail