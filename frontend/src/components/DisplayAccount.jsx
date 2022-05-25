import React, { useContext, useState, useEffect } from "react";
/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";
import axios from 'axios';


//TODO 
////display all user info from db
//request.username en back, pas besoin de fetch
////ajout modification de la profil pic
//ajout validation nouveau mdp
//pas POST mais PUT
//confiramation avec le password existant
//modal de confirmation
//modal de modification de mdp : cf ModalRoom


const DisplayAccount = () => {
  let { userId, authTokens } = useContext(AuthContext);
  const url = 'http://127.0.0.1:8000/api/user'
  const [userInfos, setUserInfos] = useState([]);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", newPasswordConfirm: "" });


  const handleChange = (e) => {setUserInfos(e.target.value);
      // console.log(e.target.value,'handleChange' )
  }
  
  useEffect(() => {
    console.log('mmh')
    axios({
        method: 'GET',
        url: `${url}/${userId}`,
        headers: { Authorization: 'Bearer ' + authTokens.access },
    })
    .then((data) =>{console.log(data.data.users, 'data')
      setUserInfos(data.data.users)
      })
    .then()
    .catch(error => console.log(error));

  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserInformations()
  }

 console.log(userInfos, 'userInfos')
  const updateUserInformations = async () => {
    const { ...data } = passwordForm;
    if (Object.values(data).every((value) => value !== "")){
     await axios({
        method: 'PUT',
        url: `${url}/${userId}/`,
        data : { ...data },
        headers: { Authorization: 'Bearer ' + authTokens.access },
        
    })
    .then((data) =>{console.log(data.data.users, 'data')})
    .catch(error => console.log(error));
  }
  }
    

  return (
<div>
      <form onSubmit={handleSubmit} id="displayAccount--form">
        <input onChange={handleChange} value={userInfos.first_name} type="text" name="first_name" placeholder='first name' />
        <input onChange={handleChange} value={userInfos.last_name} type="text" name="last_name" placeholder='last name' />
        <input onChange={handleChange} value={userInfos.email} type="text" name="email" placeholder='email' />
        <input onChange={handleChange} value={userInfos.nickname} type="text" name="nickname" placeholder='nickname' />

        {/* <input onChange={handleChange} value={userInfos.birthdate} type="date" name="birthdate" placeholder='birthdate' /> */}

        {/* <input onChange={handleChange} value={form.username} type="text" name="username" placeholder="username" /> */}

        {/* <input onChange={handleChange} value={passwordForm.password} type="password" name="password" placeholder="password" /> */}

        <input type="submit" value='save'/>

        {/* to add later */}
        {/* <input type="file" /> */}
      </form>
      <form>
        <input onChange={handleChange} value={passwordForm.password} type="password" name="password" placeholder="password" />
        <input onChange={handleChange} value={passwordForm.newPassword} type="password" name="newPassword" placeholder="new password" />
        <input onChange={handleChange} value={passwordForm.newPasswordConfirm} type="password" name="newPasswordConfirm" placeholder="confirm new password" />
        <input type="submit" value='save new password' />
      </form>
    </div>
  )
}

export default DisplayAccount;