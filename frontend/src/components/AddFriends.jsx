import React from 'react';
import { useEffect } from 'react';

const AddFriends = (props) => {
   console.log(props.contact, 'sisisi');

   const message = {
        alreadyFriends: 'You are already friends with this user',
        added: 'You have added this user',
        error: 'invalid User name'
    };

    
    // const [contacts, setContacts] = useState([]);

// se servir de 

    // const handleSubmit = (e, input) => {
    //     e.preventDefault();

    // }
    // const checkInput = (input) => {
    //     console.log(input, 'input');
    //     if (input.length > 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    const compareFriends = (input) => {
        const friends = props.contacts;
        console.log(props.contacts, 'props.contacts');
        const isFriend = false;
        friends.forEach(friend => {
            if (friend.nickname === input) {
                isFriend = true;
            }
        });
        return isFriend;
    }


    const handleSubmit = (e, input) => {
        e.preventDefault();
        // if (checkInput(input) == true) {
        const apiUrlUser = 'user/'+ input
        fetch(apiUrlUser)
        .then(response => response.json())
        .then(data => console.log(data, 'data'))
        .catch(error => console.log(error));
        // } else {
        //     alert(message.error);

        // }
    }

    const addFriendToContact = async (input) => {
        let formField = new FormData();
        formField.append('nickname', input);

        let response = await fetch('url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(formField)
          });
        }

  return (
    <div>
        <form action="submit" onSubmit={handleSubmit} >
            <input type="text" name="nickname" placeholder="Search Player"  />
            <button type="submit">Search</button>
        </form>
        <span>
            {/* {data} */}
        </span>
        

    </div>
  )
}

export default AddFriends;