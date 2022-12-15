import {useState, useEffect, useContext} from 'react';
import AuthContext from "@context/AuthContext";
import Input from '@components/Profile/Input';
import jwt_decode from "jwt-decode";

/* services ----------------------------- */
import { editProfile, getUserProfile, 
    // getContactProfiles 
} from '@services/users/users.services';
import  { getContacts } from "@services/contacts/contacts.services"
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
    // const last_login = jwt_decode(authTokens.access).last_login
    // const proper_date = Date.parse(last_login + ' GMT')
    // console.log(authTokens, last_login, proper_date)
    useEffect(() => {
        getUserProfile(authTokens.access)
          .then((response) => {
            setModalInput(response);
          })
          .catch((error) => console.log(error));
          getContacts(authTokens.access)
          .then((response) => {
            console.log("response dans then", response);
            setFriends(response);
          })
          .catch((error) => console.log(error));
    }, [authTokens.access]);


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
        <button onClick={handleSubmit}/>
      </form>
    )
}

export default EditProfile;