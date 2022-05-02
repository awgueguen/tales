import React, {useState} from 'react'

const Home = () => {

  const [inputValue, setInputValue] = useState('')

    const handleChange = (e) => {
        e.preventDefault()
        setInputValue(e.target.value)
    }
    const sendInput = () => {

    }

  return (
    <>
      page d'accueil
      <div className='text_input'>
        <input type='text' name='message'value={inputValue} onChange={handleChange} />
        <button onClick={sendInput} />
      </div>
      <div className='conversation'>
        {inputValue}
      </div>
    </>
  )
}

export default Home