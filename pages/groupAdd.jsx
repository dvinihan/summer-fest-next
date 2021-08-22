import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { addGroup } from '../services/group-service';
import { setActiveGroupId, getActiveUserClearance } from '../helpers';

const GroupAdd = () => {
  const [group, setGroup] = useState();
  const [error, setError] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  const handleAddGroup = () => {
    addGroup(group.group_name, group.leader_name).then((response) => {
      if (response.error) {
        setError(true);
      } else if (response.group && response.group.id) {
        setActiveGroupId(response.group.id);
        setShouldRedirect(true);
      }
    });
  };

  const activeUserClearance = getActiveUserClearance();

  if (shouldRedirect) {
    return (
      <Redirect
        to={{
          pathname: '/groupEdit',
        }}
      />
    );
  }

  if (activeUserClearance !== 'admin') {
    return (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    );
  }

  return (
    <div className="container" method="post">
      <h3>Group Name:</h3>
      <input
        onChange={handleChange}
        className="group-add-input"
        name="group_name"
      />

      <h3>Leader Name:</h3>
      <input
        onChange={handleChange}
        className="group-add-input"
        name="leader_name"
      />
      <br />

      <button className="save-button" type="button" onClick={handleAddGroup}>
        Save
      </button>

      {error && (
        <div id="error">There&apos;s been an error. Please try again.</div>
      )}
    </div>
  );
};

export default GroupAdd;
