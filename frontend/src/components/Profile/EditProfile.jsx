import {useState, useEffect, useContext} from 'react';
import AuthContext from "@context/AuthContext";
import Input from '@components/Profile/Input';

/* services ----------------------------- */
import { editProfile, getUserProfile, 
    // getContactProfiles 
} from '@services/users/users.services';
import  { getContacts, removeContact } from "@services/contacts/contacts.services"
const EditProfile = (props) => {
    /**
     * TODO -> change image edition, eventually reuse some component that Alex would have done ?
     * Add status system (we have last_login and is_active) is_active was true even for offline contacts, need to investigate the way it works in drf
     * */ 
    
    const [friends, setFriends] = useState();
    const fields = [
        'first_name',
        'last_name',
        'email',
        'nickname',
        'profile_pic',
    ];

    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
        getUserProfile(authTokens.access)
          .then((response) => {
            setModalInput(response);
          })
          .catch((error) => console.log(error));
          getContacts(authTokens.access)
          .then((response) => {
            setFriends(response);
          })
          .catch((error) => console.log(error));
    }, [authTokens.access]);

    const removeFriend = (e, username) => {
      e.preventDefault()
      removeContact(authTokens.access, {receiver: username})
        .then((response) => console.log(response))
        .catch((error) => console.log(error))
    }
    const [modalInput, setModalInput] = useState();

    const handleSubmit = (e) => {
        e.preventDefault()
        editProfile(authTokens.access, modalInput)
          .then((response) => {
            console.log('response après le put', response);
          })
          .catch((error)=> console.log(error))
    }

    const handleChange = (e) => {
        e.preventDefault();
        setModalInput({
            ...modalInput,
            [e.target.name] : e.target.value
        })
    }
    return(
      <>
      <form>
        { modalInput && fields.map((field, index) => {
          return (
            <Input 
              key={index}
              name={field}
              handleChange={handleChange}
              value={modalInput[field]}
            />
          )
        })}
        <button onClick={handleSubmit}>SAVE CHANGES</button>
      </form>
      {friends && friends.map((friend, index) => {
        return(
          <div key={index}>
            <p>{friend.username}</p>
            <p>{friend.nickname}</p>
            <p>{friend.last_activity}</p>
            <p onClick={(e) => removeFriend(e, friend.username)}> X </p>
          </div>
        )
      })}
      </>
    )
}

export default EditProfile;