import React, { useState, useEffect, useContext } from 'react'
import AuthContext from "@context/AuthContext";
import axios from 'axios';
import LoremIpsum from './LoremIpsum';
import {Link} from 'react-router-dom';

const RoomList = (props) => {

    const { authTokens, userId } = useContext(AuthContext);
    // const [contactListIds, setContactListIds] = useState('');
    // const [contactListName, setContactListName] = useState([])

    const [contactIdList, setContactIdList] = useState('');
    const [contactNameList, setContactNameList] = useState([])
    const url = 'http://localhost:8000/api/user/'
    // à modifier par l'@ ip
    // user/<int:user_id>/contact_list/

    useEffect( () => {
        axios({
            method: "GET",
            url: `${url}${userId}/contact_list`,
            headers: { Authorization: 'Bearer ' + authTokens.access }
            })
        .then((response) => {
            setContactIdList(response.data.user_contact)
    
        }).catch((error) => {
            console.log(`error: ${error}`)
        })
    // eslint-disable-next-line
    }, [userId])

    useEffect( () => {
        for (let elem of contactIdList){
            axios({
                method: "GET",
                url: `${url}${elem.receiver}`,
                headers: { Authorization: 'Bearer ' + authTokens.access }
                })
            .then((response) => {
                setContactNameList((prev) => [...prev, response.data.users])
                // ajouter filter pour ne pas remettre des élements deja présents ?
            }).catch((error) => {
                console.log(`error: ${error}`)
            })
        }
    // eslint-disable-next-line
    }, [contactIdList])

  return (
      <>
        <li>
            {contactNameList.length > 0  && contactNameList.filter((elem, index) => contactNameList.indexOf(elem) === index).map( (contact, index) => 
                <ul key={index}>
                    {contact.nickname}
                </ul>
            )}
        </li>
        {/* <LoremIpsum size={10}/>
        <Link to='/rooms'>to rooms</Link> */}
    </>
  )
}

export default RoomList