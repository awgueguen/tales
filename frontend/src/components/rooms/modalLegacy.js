import React, {useState, useEffect, useContext} from 'react';
import CustomInput from '@components/CustomInput';
import AuthContext from "@context/AuthContext";
import axios from 'axios';

const ModalRoom = () => {
    /**
     * Modal qui permet de créer une room
     * 
     * TODO: Ajouter les potentielles invitations en utilisant le composant DisplayFriends
     * Ajouter la view correspondante
     * _______
     */
    const { authTokens, userId } = useContext(AuthContext);
    const [stories, setStories] = useState()
    const [friends, setFriends] = useState()
    const [input, setInput] = useState({
        title: '',
        maxParticipants: '2',
        description: '',
        img: '',
        invitations: [],
        story: {id: '', title: ''},
        ispublic: true
    });

    const handleStorySelect = (e) => {
        e.preventDefault()
        const {name} = e.target
        setSelectedStory(stories[name]);
        setStep(1);
    }
    const [selectedStory, setSelectedStory] = useState()
    const [step, setStep] = useState(0)
    
    //
    const handleChange = (e) => {
        const {name, type} = e.target
        // const file = e.target?.files
        const value = type === 'checkbox' ? e.target.checked : e.target.value
        if (name === "story"){
            // c'est pas clair, peut être à réecrire plus propre
            setInput({...input, story: stories.filter((s) => s.id == value)[0]})
            return
        }
        setInput( (prevState) => ({
          ...prevState,
        //   ...(e.target.type === 'file' && {'files': e.target.files}), // pour ajoùter une img
          [name]: value,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const url = "http://127.0.0.1:8000/api/room/create/"
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
    const filterfriends = (list, userId) => {
        let output = []
        console.log(`${list} in array`)
        for (let elem of list){
            if(elem.sender == userId){
                output.push(elem.receiver)
            }
            else if(elem.receiver == userId){
                output.push(elem.sender)
            }
        }
        return output
    }
    useEffect( () => {
        const request = axios.CancelToken.source()

        const changeStoryState = (response) => {
            // setStories(response.data.stories.map((story) => ({id: story.id, title: story.title})))
            setStories(response.data.stories)
            setInput({...input, story: {id: 1, title: response.data.stories[0].title}})
        }
        const changeFriendsState = (response) => {setFriends(response.data.user_contact)}

        const fetch = async (method, url, changeState) => {
            await axios({
                url: url,
                method: method,
                headers: {Authorization: `Bearer ${authTokens.access}`},
                cancelToken: request.token,
            })
            .then ((response) => {
                changeState(response)
            })
            .catch((e) => console.log('error', e))
        }

        fetch('get', "http://localhost:8000/api/stories", changeStoryState)
        fetch('get', `http://localhost:8000/api/user/contact_list/`, changeFriendsState)
        // user/<int:user_id>/contact_list///
        return () => { request.cancel(); }
    }, [])

    useEffect(() => {
        console.log(stories)
    }, [stories])

    useEffect(() => {
        if (friends == undefined) return
        console.log(friends)
    }, [friends])

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
                <select name='story' id='select-room' onChange={handleChange} > 
                {/* value={input.story.id} */}
                {stories.map((story, index) => 
                <option key={index} value={story.id} className={`select-option select-opt-${index}`}>{story.title}</option>
                )
                }</select>
                }
            </div>
            <div className='invite-friends-box'>
                Add Players
                {friends !== undefined && 
                    <>
                <div className='friends-box'>
                    {friends.map((friend, index) => {

                    })}
                </div>
                <select name='story' id='select-room' onChange={handleChange} > 
                {/* value={input.story.id} */}
                {stories !== undefined && stories.map((story, index) => 
                <option key={index} value={story.id} className={`select-option select-opt-${index}`}>{story.title}</option>
                )
                }</select>
                </>}
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

export default ModalRoom;