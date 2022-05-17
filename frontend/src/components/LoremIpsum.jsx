import React from 'react'
import "@styles/lorem.css"
const LoremIpsum = ({size}) => {
    const lorem_text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ullamcorper elit nisi, non tempor augue semper molestie. Curabitur vel diam at turpis facilisis viverra at ut neque. Nam maximus eget risus vel porta. Mauris iaculis augue dui, a egestas ex mattis eget. Mauris posuere ante massa, nec euismod ante rutrum id. Nunc pellentesque iaculis felis, non fringilla arcu laoreet sit amet. Mauris mi libero, laoreet eget nisi a, vestibulum rutrum lorem.'
    let lorem_list = []
    while (lorem_list.length < size){
        lorem_list = [...lorem_list, lorem_text]
    }
  return (

    <div className='lorem-wrapper'>
      {lorem_list.map((lorem, index) => 
        <div className='lorem-block' key={index}>
          {lorem}
        </div>
        )}
    </div>
  )
}

export default LoremIpsum