/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React from "react";

const Register = ({ values, handleChange, handleSubmit }) => {
  const { username, password, passwordConfirmation, email, rgpd } = values;
  return (
    <>
      <form name="register" onSubmit={handleSubmit}>
        <input value={username} onChange={handleChange} type="text" name="username" placeholder="username" />
        <input value={password} onChange={handleChange} type="text" name="password" placeholder="password" />
        <input
          value={passwordConfirmation}
          onChange={handleChange}
          type="text"
          name="passwordConfirmation"
          placeholder="re-type password"
        />
        <input value={email} onChange={handleChange} type="email" name="email" placeholder="email" />
        <label className="input-checkbox">
          <input value={rgpd} onChange={handleChange} type="checkbox" name="rgpd" />I agree with the terms and
          conditions.
        </label>
        <input type="submit" />
      </form>
    </>
  );
};

export default Register;
