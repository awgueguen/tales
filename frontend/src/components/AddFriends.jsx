import React, { useContext, useState } from "react";
/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";
import axios from 'axios';

//TODO --------------------------------- */
//empecher se rajouter sois même en ami
//


const AddFriends = (props) => {
    let { userId, authTokens } = useContext(AuthContext);


    const url = 'http://127.0.0.1:8000/api/user'
    const [contact, setContact] = useState([]);
    const message = {
        alreadyFriends: 'You are already friends with this user',
        added: 'You have added this user',
        error: 'User can not be found'
    };

    
    const handleChange = (e) => {setContact(e.target.value);
    console.log(e.target.value,'handleChange' )}




// compare la liste de contacts fetch de l'utilsiateur fetch à celui rentré en input
    const compareFriends = (input) => {
        const friends = props.contacts;
        console.log(props.contacts, 'props.contacts');
        const isFriend = false;
        friends.forEach(friend => {
            if (friend.username === input) {
                isFriend = true;
            }
        });
        return isFriend;
    }

// vérfie que le contact existe dans la db avec l'input(username) du contact
    const checkContactExistence = async () => {
        const request = await axios({
            method: 'GET',
            url: `${url}/${contact}/add`,
            headers: { Authorization: 'Bearer ' + authTokens.access }

        })
        //url = http://127.0.0.1:8000/api/user
        // http://127.0.0.1:8000/api/user/username/
        // http://127.0.0.1:8000/api/user/userId/contacts
        .catch(error => console.log(error));
        console.log(request, 'request')
            return request !== undefined
       
        // const isExisting = false;
        //         if (data === null) {
        //             isExisting = true
        //         }
        //     return isExisting;
    }

// 
    const addFriendToContact = async (input) => {
        const request2 = await axios({
            method: 'POST',
            url: `${url}/${contact}/add`,
            headers: { Authorization: 'Bearer ' + authTokens.access }

        })
        .catch((error) => console.error(error));
        }
        console.log(request2, 'request2')


// ou mettre async ?
    const handleSubmit = (e, input) => {
        e.preventDefault();
        if (compareFriends(input) === false && checkContactExistence() === false){
            addFriendToContact(input)
                return message.added // ajout
        }
        else if (compareFriends(input) === true){
            return message.alreadyFriends // deja ami
        }
        else {
            return message.error // contact introuvable
        }
    }
// quel implication avec le model contact ?

  return (
    <div>
        <form action="submit" onSubmit={handleSubmit} >
            <input type="text" name="username" placeholder="Search Player" onChange={handleChange}/>
            <button type="submit">Search</button>
        </form>
        <span>
            {/* {data} */}
        </span>
        

    </div>
  )
}

export default AddFriends;