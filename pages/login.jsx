import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../services/user-service';
import {
  setActiveGroupId,
  setActiveUserClearance,
  setActiveUserName,
} from '../helpers';
import './Login.css';

const Login = () => {
  const router = useRouter();

  const [error, setError] = useState();
  const [redirectUrl, setRedirectUrl] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleUsernameChange = (e) => {
    if (e.key === 'Enter') {
      login();
    } else {
      setUsername(e.target.value);
    }
  };
  const handlePasswordChange = (e) => {
    if (e.key === 'Enter') {
      login();
    } else {
      setPassword(e.target.value);
    }
  };

  const handleLogin = () => {
    login(username, password).then((response) => {
      if (response.error) {
        setError(response.error.message);
      } else {
        setActiveUserClearance(response.user.status);
        setActiveUserName(response.user.username);
        setActiveGroupId((response.group && response.group.id) || 0);

        setRedirectUrl(response.redirectUrl);
      }
    });
  };

  const toggleShowPassword = () => {
    const element = document.getElementById('password-input');
    if (element.type === 'password') {
      element.type = 'text';
    } else {
      element.type = 'password';
    }
  };

  if (redirectUrl) {
    router.push(redirectUrl);
  }

  return (
    <div className="login">
      <h3 className="login-text login-header">Login</h3>
      <div className="login-text">Username:</div>
      <input
        id="username-input"
        name="username"
        onChange={handleUsernameChange}
      />
      <div className="login-text">Password:</div>
      <input
        id="password-input"
        name="password"
        type="password"
        onChange={handlePasswordChange}
      />
      <div className="login-text">
        <input type="checkbox" onClick={toggleShowPassword} />
        Show Password
      </div>
      <button onClick={handleLogin} type="button">
        Log In
      </button>

      {error && <div>{error}</div>}
    </div>
  );
};

export default Login;
