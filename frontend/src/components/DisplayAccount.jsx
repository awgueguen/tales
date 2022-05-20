import React, { useContext, useState } from "react";
/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";

//TODO 
//display all user info from db
//make a button to edit account
//request.username en back, pas besoin de fetch
//ajout modification de la profil pic
//ajout validation nouveau mdp
//vérifier que les informations modifiées ne sont pas associées à un autre compte
//pas POST mais PUT


const DisplayAccount = () => {
  let { userId, authTokens } = useContext(AuthContext);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    nickname: "",
    birthdate: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {setForm(e.target.value);
      // console.log(e.target.value,'handleChange' )
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const getUserInformations = async () => {
    const request0 = await axios({
        method: 'GET',
        url: ``,
        headers: { Authorization: 'Bearer ' + authTokens.access },
    })
    .catch(error => console.log(error));
  }

  const updateUserInformations = async () => {
    const request1 = await axios({
        method: 'POST',
        url: `user/${userId}/`,
        headers: { Authorization: 'Bearer ' + authTokens.access },
        data : truc,
    })
    .catch(error => console.log(error));
  }
    

  return (
<div>
      <form onSubmit={handleSubmit} id="displayAccount--form">
        <input onChange={handleChange} value={form.first_name} type="text" name="first_name" placeholder="first name" />

        <input onChange={handleChange} value={form.last_name} type="text" name="last_name" placeholder="last name" />

        <input onChange={handleChange} value={form.email} type="text" name="email" placeholder="email" />

        <input onChange={handleChange} value={form.nickname} type="text" name="nickname" placeholder="nickname" />

        <input onChange={handleChange} value={form.birthdate} type="date" name="birthdate" placeholder="birthdate" />

        <input onChange={handleChange} value={form.username} type="text" name="username" placeholder="username" />

        <input onChange={handleChange} value={form.password} type="password" name="password" placeholder="password" />

        <input type="submit" />

        {/* to add later */}
        <input type="file" />
      </form>
    </div>
  )
}

export default DisplayAccount;