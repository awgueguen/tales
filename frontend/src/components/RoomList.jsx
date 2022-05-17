import React, { useState, useEffect, useContext, useCallback } from 'react'
import AuthContext from "@context/AuthContext";
import axios from 'axios';

import RoomDetail from '@components/RoomDetail'
import ModalForm from '@components/ModalForm';

const RoomList = (props) => {

    const { authTokens, userId } = useContext(AuthContext);    
    const [roomsIdsList, setRoomsIdsList] = useState('');
    // liste des rooms où userId participe
    // roomparticipant.room (+nick?) where user = userId

    const [roomsTitle, setRoomsTitle] = useState([])
    // liste du nom des rooms où userId participe
    // rooms.title where rooms.id = roomsIdsList[x]

    const [roomsParticipants, setRoomsParticipants] = useState({}) //
    // list des participants de chaque room où userId participe
    // RoomParticpant.user (+nick?) where room.id = roomsIdsList[x]

    const url_list = 'http://localhost:8000/api/room/list/'
    // room/list/<int:user_id>/
    const url_get = 'http://localhost:8000/api/roomparticipant/list/'
    // roomparticipant/list/<int:room_id>/

    // const url = 'http://localhost:8000/api/room
    const [modal, setModal] = useState(false)
    const handleModal = () => {
        // on ouvre un modal pour créer une room (autre composant ?)
        setModal(!modal)
        return
    }
    const handleDetail = (roomId) => {
        /*const rooms = {...state}
        rooms[roomId].detail = true
        setState(rooms)
        */
            /*
            setState( (prev) => ( { ...prev, [roomId.detail] : true} ))
            ça marche pareil ?
            */
        return
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
            .then ((response) => setRoomsIdsList(response.data.rooms))
            .catch((e) => console.log('error', e))
        }

        fetch('get', `${url_list}${userId}`)

        return () => { request.cancel(); }
    // eslint-disable-next-line
    }, [userId])

    useEffect( () => {

        //mettre la fonction qui suit dans un hook / useCallback qui dépend de [...params]
        for (let elem of roomsIdsList){
            axios({
                method: "GET",
                url: `${url_get}${elem.room}`, //dd
                headers: { Authorization: 'Bearer ' + authTokens.access }
                })//
            .then((response) => {
                console.log(response)
                setRoomsParticipants((prev) => ({...prev, [elem.room]: response.data.roomparticipant}))

            }).catch((error) => {
                console.log(`error: ${error}`)
            })
        }
    // eslint-disable-next-line
    }, [roomsIdsList])

    useEffect( () => {
        console.log(roomsParticipants)
    }, [roomsParticipants])

  return (
      <>
        <li className='room-list-container'>
            {Object.keys(roomsParticipants).length > 0  && Object.keys(roomsParticipants).map( (room, index) => {
                console.log(room)
                return(
                <ul key={index} className={`room-${room.public ? 'public' : 'private'}`}>
                {/* private avec un :before et un petit cadenas ou une mise en forme particulière à voir */}
                
                    <div className='room-title'>{Object.keys(room)} : {roomsParticipants[room].map( (x) => x.nickname) }
                    </div>
                    <button className='show-room-detail' onClick={(room) => {handleDetail(room.id)} }>Detail</button>
                    {/* Il faudra faire en sorte de repasser detail en false lors du click n'importe où ailleurs (cf unikorn) */}
                    {/* Par ailleurs pour l'instant on ouvre pas le detail d'une room en particulier, il faut réflechir à ça 
                    Imo solution -> dictionnaire avec en key les rooms, en value les valeurs de retour du fetch + detail : false qu'on peut changer et du coup on envoie la room au handleDetail et magie*/}
                        <div className='detail-wrapper'>
                            {room.detail ?
                                <RoomDetail room={room}/>
                            : ''}
                        </div>

                </ul>)
            })}
        </li>
        <button className='create-room' onClick={handleModal}>Create Room</button>
        {modal ? <ModalForm />: ''}
    </>
  )
}

export default RoomList