import React, {useState, useEffect, useContext} from 'react';
import CustomInput from './CustomInput';
import AuthContext from "@context/AuthContext";
import axios from 'axios';

const ModalForm = () => {
    /**
     * Modal qui permet de créer une room
     * 
     * TODO: Ajouter les potentielles invitations en utilisant le composant DisplayFriends
     * Ajouter la view correspondante
     * _______
     */
    const { authTokens } = useContext(AuthContext);
    const [stories, setStories] = useState()
    const [input, setInput] = useState({
        title: '',
        maxParticipants: '2',
        story: {id: 1, title: ''},
        ispublic: true
    });
    const [roomParticipant , setRoomParticipant] = useState()
    //
    const handleChange = (e) => {
        const {name, type} = e.target
        // const file = e.target?.files
        const value = type === 'checkbox' ? e.target.checked : e.target.value
        setInput( (prevState) => ({
          ...prevState,
        //   ...(e.target.type === 'file' && {'files': e.target.files}), // pour ajoùter une img
          [name]: value,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const url = "http://127.0.0.1:8000/api/room/create/"
        console.log('test', input)
        axios({
            url: url,
            method: 'POST',
        // Il faut vérifier que roomParticipant.length < maxParticipant
            data: {room:{...input, story: input.story.id}, }, // roomParticipant:[...roomParticipant]
            headers: {Authorization: `Bearer ${authTokens.access}`},
        })
        .then ((response) => console.log(response)) // ajouter le traitement ici
        // redirect vers la room crée ?
        .catch((e) => console.log('error', e))
    }

    useEffect( () => {
        const request = axios.CancelToken.source()
        const fetch = async (method, url) => {
            await axios({
                url: url,
                method: method,
                headers: {Authorization: `Bearer ${authTokens.access}`},
                cancelToken: request.token,
            })
            .then ((response) => {
                console.log(response)
                setStories(response.data.stories.map((story) => ({id: story.id, title: story.title})))
            })
            .catch((e) => console.log('error', e))
        }

        fetch('get', "http://localhost:8000/api/stories")

        return () => { request.cancel(); }
    }, [])

  return (
    <>
    <div className='modal-wrapper'>
        <div className='modal-box'>
            <CustomInput 
                id='title' // important pour le bon fonctionnement d'avoir un id
                placeHolder='title'
                onChange={handleChange}
                name='title'
                value={input.title}
                type='text'
                positionClass=''
                divClassName='sign_group'
            />
            <div className='max-participant-box'>
                Maximum players
                {input.maxParticipants}
                <input
                    onChange={handleChange}
                    className='range-input'
                    name='maxParticipants'
                    value={input.maxParticipants}
                    type='range'
                    max='5'
                    min='1'
                    step='1'
                />
            </div>
            <div className='story-box'>
                Choose a story
                {stories !== undefined && 
                <select name='story' value={input.story.id} id='select-room' onChange={handleChange} > 
                {stories.map((story, index) => 
                <option key={index} value={story.id} className={`select-option select-opt-${index}`}>{story.title}</option>
                )
                }</select>
                }
            </div>
            <div className='checkbox-public'>
                Do you want to make the room public ?
                <input name='ispublic' type='checkbox' checked={input.ispublic} onChange={handleChange}/>
            </div>
            <button type='submit' onClick={handleSubmit} className='submit-btn'>Add Room</button>
        </div>
    </div>
    </>
  )
};

export default ModalForm;