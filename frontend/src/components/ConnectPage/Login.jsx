/**
 * * CLEAN CODE
 */
/* global ------------------------------------------------------------------ */
import React from "react";

const Login = ({ values, handleChange, handleSubmit }) => {
  const { username, password } = values;
  return (
    <div>
      <form name="connect" onSubmit={handleSubmit}>
        <input value={username} onChange={handleChange} type="text" name="username" placeholder="username" />
        <input value={password} onChange={handleChange} type="password" name="password" placeholder="password" />
        <input type="submit" hidden />
      </form>
    </div>
  );
};

export default Login;
