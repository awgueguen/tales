import React, {useState} from 'react'
import { useLocation } from "react-router";

const ModalRegister = (props) => {
    // const {first_name, last_name, nickname, birthdate, img, handleChange} = props
    const inputs = {...useLocation()?.state?.inputs}
    console.log(inputs)
    const handleChange = (e) => {
        const {name, value} = e.target
        if (name !== 'birthdate'){
        setInput(prev => ({...prev, [name]: value}))
        } else {
            setInput(prev => ({...prev, birthdate: '1111-11-11'}))
        }
    }
    const {test, setInput} = useState({
        first_name: '',
        last_name: '',
        nickname: '',
        birthdate: '',
    })
  return (
    <div className='register-modal-wrapper'>
      <div className='register-modal-title'>
        One last Step
      </div>
      <div className='register-inputs-wrapper'>
        <input type='text' name='first_name' value={test.first_name} onChange={handleChange} placeholder='first_name*' />
        <input type='text' name='last_name' value={test.last_name} onChange={handleChange} placeholder='last_name*' />
        <input type='text' name='nickname' value={test.nickname} onChange={handleChange} placeholder='displayed name*' />
        <input type='text' name='birthdate' value={test.birthdate} onChange={handleChange} placeholder='birthdate*' />
        {/* ajouter le champ image */}

        <input type="submit" hidden/>
      </div>
    </div>
  )
}

export default ModalRegister