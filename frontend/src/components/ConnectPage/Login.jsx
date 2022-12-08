/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React from "react";

const Login = ({ values, handleChange, handleSubmit, errors, errorState }) => {
  const { username, password } = values;
  return (
    <div id="connect__login">
      <form name="connect" onSubmit={handleSubmit}>
        <input value={username} onChange={handleChange} type="text" name="username" placeholder="username" />
        <input value={password} onChange={handleChange} type="password" name="password" placeholder="password" />
        <span className="error">{errorState ? errors : ""}</span>
      </form>
    </div>
  );
};

export default Login;
