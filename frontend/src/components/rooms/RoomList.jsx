import React, { useState, useEffect, useContext } from 'react'
import AuthContext from "@context/AuthContext";
import axios from 'axios';

import ModalRoom from '@components/rooms/ModalRoom';
import PrivateCard from '@components/rooms/PrivateCard';
import PublicCard from '@components/rooms/PublicCard';
import { Link } from 'react-router-dom';

/**
 * TODO : adapter les Link
 * TODO: associer les characters à l'id deja récup (useEffect l.52)
 * 
 */

const RoomList = (props) => {
    
    const { authTokens, userId } = useContext(AuthContext);    


    const [modal, setModal] = useState(false)
    const handleModal = () => {
        setModal(!modal)
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
        //eslint-disable-next-line
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
{/* ______private-room-wrapper */}
      <div className='private-room-wrapper'>
        <div className='existing-rooms'>
            {roomList !== undefined && roomList.map((r, index) => {
            return(
                <>
                  <Link
                    key={index} className='private-card-link'
                    to={`/rooms/${r.id}`}
                  >
                  <PrivateCard
                    isAdmin={r.isAdmin}
                    img={r.room.story.image}
                    title={r.room.story.title}
                  />
                  </Link>
                </>
            )
            })}
        </div>

        <div className='create-room' onClick={handleModal}> 
        {/**
         * background '+' en image?
         */}
         <div style={{color:'red', fontSize:'20px'}}>+ Click here to show how to Add room</div>
        </div>
        {modal ? <ModalRoom /> : ''}

      </div>
{/* ______ private-room-wrapper */}


{/* ______ public-room-wrapper */}
      <div className='public-room-wrapper'>
          {publicList !== undefined && publicList.map((r, index)=> {
/* ici on return un lien si on peut rejoindre ou une div avec className si full pour la mettre en opacity inférieure en css ? */
              return(
            <>
            {r.participants.length === r.maxParticipants ?
              <div className='full-public-room' key={index}>
                <PublicCard
                  title={r.story.title}
                  description={r.story.description}
                  img={r.story.image}
                  full={true}
                />
              </div>
            :
              <Link
              key={index}
              className='public-card-link'
              to={`/rooms/${r.id}`}>
                <PublicCard
                  title={r.story.title}
                  description={r.story.description}
                  img={r.story.image}
                  participants={r.participants}
                  max_participants={r.maxParticipants}
                />
              </Link>
            }
            
            </>
            )
          })
          }
      </div>
{/* ______ public-room-wrapper */}
    </>
  )
}

export default RoomList