import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { getActiveUserClearance } from '../helpers';
import Group from '../models/Group';

const GroupAdd = ({ groups = [] }) => {
  const [group, setGroup] = useState(new Group());

  const mutation = useMutation((newGroup: Group) =>
    axios.post('/api/addGroup', newGroup)
  );

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  const handleAddGroup = () => {
    const maxGroupId = groups.reduce(
      (max, group) => Math.max(max, group.id),
      0
    );

    mutation.mutate({
      id: maxGroupId + 1,
      group_name: group.group_name,
      leader_name: group.leader_name,
    });
  };

  // if (mutation.data) {
  //   return (
  //     <Redirect
  //       to={{
  //         pathname: '/groupEdit',
  //       }}
  //     />
  //   );
  // }

  // const activeUserClearance = getActiveUserClearance();
  // const activeUserClearance = getActiveUserClearance();
  // if (typeof window !== 'undefined' && activeUserClearance !== 'admin') {
  //   router.replace('/');
  //   return null;
  // }

  return (
    <div className="container">
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

      {mutation.error && (
        <div id="error">There&apos;s been an error. Please try again.</div>
      )}
    </div>
  );
};

export async function getStaticProps() {
  const { BASE_URL } = process.env;

  const res = await fetch(`${BASE_URL}/api/groups`);
  const json = await res.json();

  return {
    props: json,
  };
}

export default GroupAdd;
