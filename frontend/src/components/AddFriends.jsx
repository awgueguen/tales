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
    const [input, setInput] = useState([]);
    const message = {
        alreadyFriends: 'You are already friends with this user',
        added: 'You have added this user',
        error: 'User can not be found'
    };

    const handleChange = (e) => {setInput(e.target.value);
    // console.log(e.target.value,'handleChange' )
    }




// compare la liste de contacts fetch de l'utilsiateur fetch à celui rentré en input
//! OK > si deja amis : TRUE
    const compareFriends = () => {
        const friends = props.contacts;
        // console.log(props.contacts, 'props.contacts');
        // console.log(input, 'contacts')
        console.log(friends?.some(({username})=> username.toLowerCase() === input.toLowerCase()))
        return friends?.some(({username})=> username.toLowerCase() === input.toLowerCase())
        // friends && friends.some(({username})=> username.toLowerCase() === input.toLowerCase());
    }

// vérfie que l'input existe dans la db avec l'input(username) du input
//! pblm ne console.log rien 
    const checkContactExistence = async () => {
        const request = await axios({
            method: 'GET',
            url: `${url}/${input}/add`,
            headers: { Authorization: 'Bearer ' + authTokens.access }
        })
        .catch(error => console.log(error));
        
        // console.log(request, 'request', {input})
        // console.log(request !== undefined, "L'utilisateur existe")
        // const existence = request === undefined
        return request === undefined
    }

// POST le input dans la db

    const addFriendToContact = async (input) => {
        const request2 = await axios({
            method: 'POST',
            url: `${url}/${input}/add`,
            headers: { Authorization: 'Bearer ' + authTokens.access },
            data : input

        })
        .catch((error) => console.error(error));
        }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(input)
        if (compareFriends() === false && await checkContactExistence() === false){
            console.log('added')
            addFriendToContact(input)
            return message.added // ajout
        }
        else if (compareFriends(input) === true){
            console.log('deja ami')
            return message.alreadyFriends // deja ami
        }
        else {
            console.log('input introuvable')
            return message.error // input introuvable
        }
    }

  return (
    <div>
        <form action="submit" onSubmit={handleSubmit} >
            <input type="text" name="username" placeholder="Search Player" onChange={handleChange}/>
            <button type="submit">Add friend</button>
        </form>
        <span>
        </span>
        

    </div>
  )
}

export default AddFriends;