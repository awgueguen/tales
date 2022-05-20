/* global ------------------------------------------------------------------ */
import React, { useContext, useEffect, useState } from "react";

const Login = ({ values, handleChange }) => {
  const { username, password } = values;
  return (
    <>
      <form name="connect">
        <input value={username} onChange={handleChange} type="text" name="username" placeholder="username" />
        <input value={password} onChange={handleChange} type="text" name="password" placeholder="password" />
      </form>
    </>
  );
};

export default Login;
