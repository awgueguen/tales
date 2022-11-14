/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React from "react";
import TermsModal from "./TermsModal";

const Register = ({ values, ...props }) => {
  const { username, password, passwordConfirmation, email, rgpd } = values;
  const { handleChange, handleSubmit, handleBlur, handleModal, errors, errorState } = props;

  return (
    <div>
      <form name="register" onSubmit={handleSubmit}>
        <input value={username} onChange={handleChange} type="text" name="username" placeholder="username" />
        <input
          value={password}
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="password"
          onBlur={handleBlur}
        />
        <input
          value={passwordConfirmation}
          onChange={handleChange}
          type="password"
          name="passwordConfirmation"
          placeholder="re-type password"
          onBlur={handleBlur}
        />
        <input value={email} onChange={handleChange} type="email" name="email" placeholder="email" />
        <label className="input-checkbox terms-modal" name="register">
          <input checked={rgpd} type="checkbox" name="rgpd" onChange={handleChange} />
          <p>
            I agree with the{" "}
            <a href="#" onClick={handleModal}>
              Terms of services.
            </a>
          </p>
        </label>
        <span className="error">{errorState ? errors : ""}</span>
      </form>
      <TermsModal handleModal={handleModal} />
    </div>
  );
};

export default Register;
