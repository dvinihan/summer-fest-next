import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signup } from '../services/user-service';
import {
  setActiveGroupId,
  setActiveUserName,
  setActiveUserClearance,
} from '../helpers';
import './Signup.css';

const Signup = () => {
  const router = useRouter();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [shouldRedirect, setShouldRedirect] = useState();
  const [error, setError] = useState();
  const [isIncomplete, setIsIncomplete] = useState();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignup = () => {
    signup(username, password).then((response) => {
      if (response.error) {
        setError(response.error.message);
      } else if (response.incomplete) {
        setIsIncomplete(true);
      } else {
        setActiveGroupId(response.group.id);
        setActiveUserClearance(response.user.status);
        setActiveUserName(response.user.username);

        setShouldRedirect(true);
      }
    });
  };

  if (shouldRedirect) {
    router.push('/groupEdit');
  }

  return (
    <>
      <div className="signup">
        <h3 className="signup-text signup-header">Signup</h3>
        <div className="signup-text">Username:</div>
        <input name="username" onChange={handleUsernameChange} />
        <div className="signup-text">Password:</div>
        <input name="password" onChange={handlePasswordChange} />
        <button className="signup-button" onClick={handleSignup} type="submit">
          Submit
        </button>

        {error && <div>{error}</div>}

        {isIncomplete && <div>You must have both a username and password.</div>}
      </div>
    </>
  );
};

export default Signup;
