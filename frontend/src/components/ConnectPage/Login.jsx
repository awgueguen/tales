/* global ------------------------------------------------------------------ */
import React, { useContext, useEffect, useState } from "react";

const Login = ({ values, handleChange }) => {
  const { username, password } = values;
  return (
    <div>
      <form name="connect">
        <input value={username} onChange={handleChange} type="text" name="username" placeholder="username" />
        <input value={password} onChange={handleChange} type="password" name="password" placeholder="password" />
      </form>
    </div>
  );
};

export default Login;
