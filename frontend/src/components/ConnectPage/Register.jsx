/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React, { useEffect, useState } from "react";
import axios from "axios";

const Register = ({ values, handleChange, handleSubmit, request, setNextStep }) => {
  /**
   * TODO:
   * terme & conditions button to {modal_condition}
   * ajouter la transition vers la page 2 de register (modal?)
   * ajouter une première vérification + affichage erreur
   * ajouter le post dans axios
   * Check case par case lesquelles sont vides pour les mettre en évidence avec le formError.*.empty
   * ajouter une width (~280) pour la checkbox vu le comportement chelou
   */
  const { username, password, passwordConfirmation, email, rgpd } = values;
  const [diffPassword, setDiffPassword] = useState(false);
  const [emptyFields, setEmptyFields] = useState(false);

  const errorMessages = {
    password: "This password isn't secure enough",
    email: "This mail is already used",
    username: "This username is already used",
    rgpd: "You must consent to legal agreements",
    empty: "You must fill all fields",
  };
  const [formError, setFormError] = useState({
    password: {
      status: true,
      empty: false,
    },
    email: {
      status: true,
      empty: false,
    },
    username: {
      status: true,
      empty: false,
    },
    rgpd: {
      status: true,
    },
    empty: {
      status: true,
    },
  });
  const doubleCheck = (e) => {
    checkForm();
    handleChange(e);
  };
  const checkForm = () => {
    let errorWithInput = [];
    const newFormError = { ...formError };
    /* empty check________________________________________________*/
    if ([username, password, passwordConfirmation, email].some((input) => input === "")) {
      newFormError.empty.status = true;
      errorWithInput.push(true);
    } else {
      newFormError.empty.status = false;
      errorWithInput.push(false);
    }

    /* Fields check________________________________________________*/
    if (password.length < 5) {
      newFormError.password.status = true;
      // setFormError((prev) => ({...prev, password: {...prev.password, status: true}}))
      errorWithInput.push(true);
    } else {
      errorWithInput.push(false);
      // setFormError((prev) => ({...prev, password: {...prev.password, status: false}}))
      newFormError.password.status = false;
    }
    if (!rgpd) {
      // setFormError((prev) => ({...prev, rgpd: {...prev.rgpd, status: true}}))
      newFormError.rgpd.status = true;
      errorWithInput.push(true);
    } else {
      errorWithInput.push(false);
      newFormError.rgpd.status = false;
    }

    /* If only everything else is good  __________________________________
    we fetch to check if username and mail are unique__________________________________*/
    if (errorWithInput.some((e) => e)) {
      const fetch = async () => {
        await axios({
          url: "http://127.0.0.1:8000/api/background-check/",
          method: "POST",
          data: { email: email, username: username },
          cancelToken: request.token,
        })
          .then((response) => {
            const { email, username } = response.data;
            if (email) {
              newFormError.email.status = false;
            } else {
              newFormError.email.status = true;
            }
            if (username) {
              newFormError.username.status = false;
            } else {
              newFormError.username.status = true;
            }
          })
          .catch((e) => console.log("error", e));
      };
      fetch();
    }
    setFormError(newFormError);
  };
  useEffect(() => {
    checkPasswords();
    const fields = Object.keys(formError).map((i) => formError[i].status);
    if (fields.some((field) => field) || diffPassword) {
      setNextStep(false);
      return;
    } else setNextStep(true);
  }, [formError]);

  const checkPasswords = () => {
    // mettre le boutton register grisé if(diffPassword) + pointeur rond rouge barré
    if (password === "" || passwordConfirmation === "") return;
    if (password !== passwordConfirmation) setDiffPassword(true);
    else setDiffPassword(false);
  };

  return (
    <>
      <form name="register" onSubmit={handleSubmit}>
        <input value={username} onChange={doubleCheck} type="text" name="username" placeholder="username" />
        <input
          value={password}
          onChange={doubleCheck}
          type="password"
          name="password"
          placeholder="password"
          onBlur={checkPasswords}
        />
        <input
          value={passwordConfirmation}
          onChange={doubleCheck}
          type="password"
          name="passwordConfirmation"
          placeholder="re-type password"
          onBlur={checkPasswords}
        />
        {diffPassword ? <p>Passwords are not the same</p> : ""}
        <input value={email} onChange={doubleCheck} type="email" name="email" placeholder="email" />
        <label className="input-checkbox" name="register">
          <input
            checked={rgpd}
            type="checkbox"
            name="rgpd"
            onChange={(e) => {
              handleChange(e, "check");
              checkForm();
            }}
          />
          I agree with the terms and conditions.
        </label>

        <input type="submit" />
      </form>
    </>
  );
};

export default Register;

/* RGPD tickbox “J'atteste de l'exactitude des informations fournies et
accepte le traitement de mes données personnelles par Tale It &copy pour les fins de fonctionnement normal du service et statistiques dans les
conditions prévues par la Politique de confidentialité (lien
hypertexte). Ces données seront supprimées au maximum un an après la
fin de ma procédure de candidature ou de la fin de ma participation à
un programme opéré par Tale It &copy. Je dispose à tout moment
d'un droit d'accès, de rectification et de suppression qui peut-être
exercé en contactant l'adresse anicet.celerier@gmail.com” */
