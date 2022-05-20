import React, {useState, useEffect, useContext} from 'react';
import CustomInput from '@components/CustomInput';
import AuthContext from "@context/AuthContext";
import axios from 'axios';
import FriendCard from '@components/FriendCard'
const ModalRoom = () => {
    /**
     * Modal qui permet de créer une room
     * 
     * TODO:
     * Mettre en place le css pour indiquer qu'on a rempli les champs par défauts mais qu'on peut les modifier
     * (input[description, title et maxPart] quand on choisit une story)
     * _______
     */
    const { authTokens } = useContext(AuthContext);
    const [stories, setStories] = useState()
    const [friends, setFriends] = useState()
    const [input, setInput] = useState({
        title: '',
        maxParticipants: '',
        description: '',
        img: '',
        invitations: [],
        story: {id: '', title: ''},
        ispublic: true
    });

    const handleStorySelect = (id) => {
        /**
         * choix de la story depuis le modal
         * et auto completion input
         *  */ 
        const selection = stories.filter((story) => story.id === id)[0]
        const {title:t, description:d, optimalPlayers:m} = selection
        setSelectedStory(selection)
        setInput({...input, title: t, description: d, maxParticipants: m})
        setStep(1);
    }

    const backwardStep = () => {
        setStep(step - 1);
    }

    const handleFriendsInvitations = (id) => {
        /**
         * ajoute un objet ami à la liste des invitations 
         * ou le supprime s'il y était déja
         */
        let invitations = [...input.invitations]
        const selected_friends_id = friends.filter((friend) => friend.id === id)[0]
        const remove = invitations.some((i) => i === selected_friends_id) 
        console.log(`test\n invit:${input.invitations.length}\nstory:${input.maxParticipants}\n`)
        if (!remove && input.invitations.length >= input.maxParticipants) {
            alert('maximum players already achieved')
            return
        }
        console.log(input.invitations)
        
        
        if (remove){
            invitations = invitations.filter((i) => i.id !== id)
            setInput({...input, invitations: [...invitations]})
        }
        else{
            invitations.push(selected_friends_id)
            setInput({...input, invitations: [...invitations]})
        }
    }
    const [selectedStory, setSelectedStory] = useState()
    const [step, setStep] = useState(0)
    
    const handleChange = (e) => {
        const {name, type} = e.target
        // const file = e.target?.files
        const value = type === 'checkbox' ? e.target.checked : e.target.value
        if (name === "story"){
            setInput({...input, story: stories.filter((s) => s.id === value)[0]})
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
            data: {room:{...input, story: input.story.id}},
            headers: {Authorization: `Bearer ${authTokens.access}`},
        })
        .then ((response) => {
            // ajouter le traitement ici
            // redirect vers la room crée ?
            console.log(response)
        })

        .catch((e) => console.log('error', e))
    }

    useEffect( () => {
        const request = axios.CancelToken.source()
        const changeStoryState = (response) => {
            setStories(response.data.stories)
            setInput({...input, story: {id: 1, title: response.data.stories[0].title}})
        }
        const changeFriendsState = (response) => {
            setFriends(response.data.user_contact)
        }

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
        return () => { request.cancel(); }
// eslint-disable-next-line
    }, [])

    useEffect(() => {
        console.log(stories)
    }, [stories])

    useEffect(() => {
        console.log(selectedStory)
    }, [selectedStory])

    useEffect(() => {
        console.log(step)
    }, [step])

    useEffect(() => {
        if (friends === undefined) return
        console.log(friends)
    }, [friends])

    useEffect(() => {
        console.log(input.maxParticipants)
    }, [input.maxParticipants])

  return (
  <>
    <div className='modal-wrapper'>
      <div className='step divider'>
        {/* les 3 barres avec potentiel hover*/}
        <div className={`lateral-bar${step===0 ? '-active': ''}`} >_</div>
        <div className={`lateral-bar${step===1 ? '-active': ''}`} >_</div>
        <div className={`lateral-bar${step===2 ? '-active': ''}`} >_</div>
      </div>
    {step !== 0? 
    <div className='modal-step-back' onClick={backwardStep}>
        METTRE UNE FLECHE GAUCHE
    </div>
    : ''}
    {step === 0 ?
    <> {/*________________.modal-story box */}
      <div className='modal-story-box'>
        Select a story
        {stories !== undefined &&
        <>
        {stories.map((story, index) => {
            return(
            <button key={index} className='modal-story-container' onClick={() => handleStorySelect(story.id)} >
                <div className='modal-story-img-container'>
                    <img className='modal-story-img' src={story.img} alt={`${story.title} img`}/>
                </div>
                <div className='modal-story-info'>
                    {/* surement redécouper title et optiPlayer pour le css? */}
                    {story.title} {story.optimalPlayers}
                </div>
                <div className='modal-story-description'>
                    {story.description}
                </div>
            </button>
            )
        })}
        </> 
        }
      </div>
      </> /*________________fin de .modal-story box */
    : step === 1 ?

        /* __________________ .modal-room-box */
      <>
        <div className='modal-room-box'>
            Customize your Room
            {selectedStory !== undefined &&
            <>
            <div className='chosenStory'>
                Story: {selectedStory.title}
            </div>
            <div className='room-form-wrapper'>
                <CustomInput 
                    id='title' // important pour le bon fonctionnement d'avoir un id
                    placeHolder={selectedStory.title}
                    onChange={handleChange}
                    name='title'
                    value={input.title}
                    type='text'
                    positionClass=''
                    divClassName='sign_group'
                />
                <CustomInput 
                    id='maxParticipants'
                    placeHolder={`Max Players : ${selectedStory.optimalPlayers}`}
                    onChange={handleChange}
                    name='maxParticipants'
                    value={input.maxParticipants}
                    type='text'
                    positionClass=''
                    divClassName='sign_group'
                />
                <CustomInput 
                    id='description'
                    placeHolder={selectedStory.description}
                    onChange={handleChange}
                    name='description'
                    value={input.description}
                    type='textarea'
                    positionClass=''
                    divClassName='sign_group'
                />
                <div className='checkbox-public'>
                Do you want to make the room public ?
                <input name='ispublic' type='checkbox' checked={input.ispublic} onChange={handleChange}/>
                </div>
                <img src={selectedStory.img} alt={`${selectedStory.title} img`}/>
                <button className='invitations-step-btn' onClick={() => setStep(2)}> {'>'}INVITATIONS</button>
            </div>
            </>}
        </div>
      </> 
      /* __________________ fin de .modal-room-box */

    : 
    /* __________________ fin.modal-invitation-box */ 
      <>
        <div className='modal-invitation-box'>
            Add Players
            <div className='chosenStory'>
                Story: {selectedStory !== undefined && selectedStory.title}
            </div>
            {friends !== undefined && friends.map((friend) => {
            return(
                <button
                onClick={() => handleFriendsInvitations(friend.id)}
                id={friend.id}
                className={`friends-invitation-btn friend-${input.invitations.some((i) => i.id === friend.id)? 'selected' : 'not-selected'}`}>
                    {/* background .friend-selected dans App.css à virer*/}
                  <FriendCard {...friend}/>
                </button>
                )
            })}
            <button type='submit' onClick={handleSubmit} className='modal-start-btn'>START</button>
        </div>
      </>
    /* __________________fin de .modal-invitation-box */
    }
</div>
</>
  )
};

export default ModalRoom;