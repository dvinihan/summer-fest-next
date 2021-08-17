import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { makeAdmin, userDelete } from '../services/user-service';
import { getActiveUserClearance, getActiveUserName } from '../helpers';

const Users = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState();
  const router = useRouter();

  useEffect(() => {
    fetch('/allData')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error();
      })
      .then((d) => {
        setData(d);
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  });

  const handleMakeAdmin = (userId) => {
    makeAdmin(userId).then((response) => {
      if (response.error) {
        setError(true);
      } else {
        setData({
          ...data,
          users: response.users,
        });
      }
    });
  };

  const deleteUser = (userId) => {
    userDelete(userId).then((response) => {
      if (response.error) {
        setError(true);
      } else {
        setData({
          ...data,
          users: response.users,
        });
      }
    });
  };

  const getGroupName = (groups, user) => {
    const group = groups.find((g) => g.id === user.group_id);
    return group && group.group_name;
  };

  if (!data.users || !data.groups) {
    return null;
  }

  const activeUserClearance = getActiveUserClearance();
  const activeUserName = getActiveUserName();

  if (activeUserClearance !== 'admin') {
    router.push('/');
  }

  return (
    <>
      <table name="users">
        <tbody>
          <tr className="table-header-row">
            <th className="header-place">User Name</th>
            <th className="header-place">Group Name</th>
            <th className="header-place">Status</th>
            <th className="header-place"></th>
            <th className="header-place"></th>
          </tr>

          {data.users.map(
            (user) =>
              user.username !== activeUserName && (
                <tr key={user.id} className="table-row">
                  <td className="table-name">{user.username}</td>
                  <td className="table-name">
                    {getGroupName(data.groups, user)}
                  </td>
                  <td className="table-name">{user.status}</td>
                  <td>
                    {user.status === 'leader' && (
                      <button
                        className="table-name"
                        onClick={() => handleMakeAdmin(user.id)}
                        type="button"
                      >
                        MAKE ADMIN (cannot be undone)
                      </button>
                    )}
                  </td>
                  <td>
                    {user.status === 'leader' && (
                      <button
                        className="table-name"
                        onClick={() => deleteUser(user.id)}
                        type="button"
                      >
                        DELETE USER (cannot be undone)
                      </button>
                    )}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
      {error && (
        <div>There&apos;s been an error. Please refresh and try again.</div>
      )}
    </>
  );
};

export default Users;
