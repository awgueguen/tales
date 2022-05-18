import React, { useState, useEffect, useContext, useCallback } from 'react'
import AuthContext from "@context/AuthContext";
import axios from 'axios';

import RoomDetail from '@components/rooms/RoomDetail';
import ModalRoom from '@components/rooms/ModalRoom';
import RoomCard from '@components/rooms/RoomCard';
import StoryCard from '@components/rooms/StoryCard';

const RoomList = (props) => {
    
    const { authTokens, userId } = useContext(AuthContext);    


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

    const url_room_list = (userId) => `http://localhost:8000/api/room/${userId}/list/`
    const [roomList, setRoomList] = useState()
    const url_pubic_rooms = 'http://localhost:8000/api/room/publiclist/'
    const [publicList, setPublicList] = useState()

    useEffect( () => {
        // fetch toutes les rooms publiques
        const request = axios.CancelToken.source()
        const fetch = async () => {
            await axios({
                url: url_pubic_rooms,
                method: 'GET',
                headers: {Authorization: `Bearer ${authTokens.access}`},
                cancelToken: request.token,
            })
            .then ((response) => {console.log(response); setPublicList(response.data)})
            .catch((e) => console.log('error', e))
        }

        fetch()

        return () => request.cancel()
    }, [])

    useEffect( () => {
        /**
         * fetch toutes les infos du joueurs (roomspart associés aux stories associées aux rooms)
         * 
         * TODO: associer les characters à l'id deja récup
         */
        const request = axios.CancelToken.source()
        const fetch = async () => {
            await axios({
                url: url_room_list(userId),
                method: 'GET',
                headers: {Authorization: `Bearer ${authTokens.access}`},
                cancelToken: request.token,
            })
            .then ((response) => {console.log(response); setRoomList(response.data)})
            .catch((e) => console.log('error', e))
        }

        fetch()

        return () => { request.cancel(); }
    // eslint-disable-next-line
    }, [userId])



    useEffect( () => {
        console.log(roomList)
    }, [roomList])

    useEffect( () => {
        console.log(publicList)
    }, [publicList])
    
  return (
      <>
      <div className='private-room-wrapper'>
        <div className='existing-rooms'>
            {roomList.map((r) => {
                return(
                    <RoomCard
                      isAdmin={r.isAdmin}
                      img={r.room.story.image}
                      title={r.room.story.title}
                    />
                )
            })}
        </div>
        <div className='create-room'>
            <button className='create-room' onClick={handleModal}>Create Room</button>
            {modal ? 
            <ModalRoom />
            : ''}
        </div>
      </div>
      <div className='public-room-wrapper'>
          {publicList.map((r)=> {
            <StoryCard 
              title={r.story.title}
              description={r.story.description}
              img={r.story.image}
              participants={r.participants}
              // ici on pourra mettre la length à la place de la liste(selon ce qu'il faut)
              max_participants={r.maxParticipants}
            />
          })
          }
      </div>
    </>
  )
}

export default RoomList