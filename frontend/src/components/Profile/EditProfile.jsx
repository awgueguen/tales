import {useState, useEffect, useContext, Fragment} from 'react';
import AuthContext from "@context/AuthContext";
import Input from '@components/Profile/Input';

/* services ----------------------------- */
import { editProfile, getUserProfile, 
    // getContactProfiles 
} from '@services/users/users.services';
import  { getContacts, getSentContacts, getWaitingContacts, removeContact, acceptContact } from "@services/contacts/contacts.services";
// import { useTranslation } from 'react-i18next';

const EditProfile = (props) => {
    /**
     * TODO -> change image edition, eventually reuse some component that Alex would have done ?
     * Add status system (we have last_login and is_active) is_active was true even for offline contacts, need to investigate the way it works in drf
     * */ 

  //  const {t} = useTranslation('common', {keyPrefix: 'profile'});
  //  const {t:te} = useTranslation('common', {keyPrefix: 'error_management.event'})

   // just a sample to remember how it works

    const getUsersStatus = (userList) => {
      
      userList.map((user, index) => {
        
        const MS_PER_MINUTE = 60000;

        const last_activity = Date.now() - new Date(user.last_activity);
        let statusFriend = friendsWithStatus.length !== 0 ? 
          [...friendsWithStatus]
          : [...friends];
        if (user.last_activity == null || user.last_activity === undefined){
          statusFriend[index].status = "offline";
        }
        else if (last_activity > 10 * MS_PER_MINUTE) {
          statusFriend[index].status = "away";
        }
        else statusFriend[index].status = "online";
        setFriendsWithStatus(statusFriend);
        return Date.now() - Date(user.last_activity) > 10 * MS_PER_MINUTE;
      })
    }
    const [friends, setFriends] = useState();
    const [sentInvitations, setSentInvitations] = useState();
    const [receivedInvitations, setReceivedInvitations] = useState();
    
    const [friendsWithStatus, setFriendsWithStatus] = useState([]);
    const fields = [
        'first_name',
        'last_name',
        'email',
        'nickname',
        'profile_pic',
    ];

    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
      if (friends) {
        getUsersStatus(friends)
      }
      //eslint-disable-next-line
    }, [friends])

    useEffect(() => {
        getUserProfile(authTokens.access)
          .then((response) => {
            setModalInput(response);
          })
          .catch((error) => console.log(error));

          getContacts(authTokens.access)
            .then((response) => setFriends(response))
            .catch((error) => console.log(error));

          getSentContacts(authTokens.access)
            .then((response) => {console.log(response, 'sent'); setSentInvitations(response)})
            .catch((error) => console.log(error));

          getWaitingContacts(authTokens.access)
            .then((response) => {console.log(response, 'received'); setReceivedInvitations(response)})
            .catch((error) => console.log(error));

    }, [authTokens.access]);

    const removeFriend = (e, username) => {
      e.preventDefault()
      removeContact(authTokens.access, {receiver: username})
        .then((response) => console.log(response))
        .catch((error) => console.log(error))
    }

    const acceptFriend = (e, username) => {
      e.preventDefault()
      acceptContact(authTokens.access, {"new_friend": username})
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

      {/**
       * friends accepted
       */}
      <div style={{border: "solid black 1px", "marginBottom": "50px"}}>
        {friends && friends.map((friend, index) => {
          return(
            <div key={index}>
              <p>{friend.username}</p>
              <p>{friend.nickname}</p>
              <p>{friend.last_activity}</p>
              <p>{friends.status}</p>
              <p onClick={(e) => removeFriend(e, friend.username)}> X </p>
            </div>
          )
        })}
      </div>

      {/**
       * sent invitations
       */}
      <div style={{border : "red solid 1px", "marginBottom": "50px"}}>
        {sentInvitations && sentInvitations.map((friend) => {
          return(
            <>
              <p>{friend.username}</p>
            </>
          )
        })}
      </div>

      {/**
       * received invitations
       */}
      <div style={{border : "green solid 1px"}}>
      {receivedInvitations && receivedInvitations.map((friend, index) => {
          return(
            <Fragment key={index}>
              <p style={{color: "blue"}} onClick = {(e) => acceptFriend(e, friend.username)}>
                {friend.username}
              </p>
            </Fragment>
          )
        })}
      </div>
      
      </>
    )
}

export default EditProfile;