/* gobal ------------------------------------------------------------------- */
import React, { useState, useContext } from "react";
import axios from "axios";
/* context & components ---------------------------------------------------- */
import AuthContext from "@context/AuthContext";
/* pages ------------------------------------------------------------------- */

/* TODO -------------------------------------------------------------------- */
//// envoyer vers le back les données
//// vérifier ce qui est renvoyé par le back
//// erreur basique via alerte
// rajouter une vérification de passworde
// validation de formulaire
// input image foncttionel
// vérifier que le mail & le username n'existent pas déjà dans la db

/* ------------------------------------------------------------------------- */
/* export                                                                    */
/* ------------------------------------------------------------------------- */

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    nickname: "",
    birthdate: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ...data } = form;

    if (Object.values(data).every((value) => value !== "")) {
      await axios({
        url: "http://127.0.0.1:8000/api/register/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: { ...data },
      })
        .then((response) => {
          if (response.status === 201) {
            loginUser(e);
          }
        })
        .catch((error) =>
          console.error({ "Ahoy matey, you got an error": error.message })
        );
    }
  };

  const handleChange = (e) => {
    setForm((prevForm) => {
      return {
        ...prevForm,
        [e.target.name]: e.target.value,
      };
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} id="register--form">
        <input
          onChange={handleChange}
          value={form.first_name}
          type="text"
          name="first_name"
          placeholder="first name"
        />

        <input
          onChange={handleChange}
          value={form.last_name}
          type="text"
          name="last_name"
          placeholder="last name"
        />

        <input
          onChange={handleChange}
          value={form.email}
          type="text"
          name="email"
          placeholder="email"
        />

        <input
          onChange={handleChange}
          value={form.nickname}
          type="text"
          name="nickname"
          placeholder="nickname"
        />

        <input
          onChange={handleChange}
          value={form.birthdate}
          type="date"
          name="birthdate"
          placeholder="birthdate"
        />

        <input
          onChange={handleChange}
          value={form.username}
          type="text"
          name="username"
          placeholder="username"
        />

        <input
          onChange={handleChange}
          value={form.password}
          type="password"
          name="password"
          placeholder="password"
        />

        <input type="submit" />

        {/* to add later */}
        <input type="file" />
        <label>
          {/* RGPD tickbox “J'atteste de l'exactitude des informations fournies et
          accepte le traitement de mes données personnelles par *nom de l'entreprise* pour les fins de fonctionnement normal du service et statistiques dans les
          conditions prévues par la Politique de confidentialité (lien
          hypertexte). Ces données seront supprimées au maximum un an après la
          fin de ma procédure de candidature ou de la fin de ma participation à
          un programme opéré par *nom de l'entreprise*. Je dispose à tout moment
          d'un droit d'accès, de rectification et de suppression qui peut-être
          exercé en contactant l'adresse anicet.celerier@gmail.com” */}
          <input type="checkbox" />
        </label>
      </form>
    </div>
  );
};

export default LoginPage;
