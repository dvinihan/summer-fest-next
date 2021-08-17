import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { setActiveGroupId, getActiveUserClearance } from '../helpers';
import { getCsvFile } from '../helpers/download-helper';
import './Admin.css';

const Admin = () => {
  const [data, setData] = useState({});

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
      .catch((error) => {
        console.log(error);
        return null;
      });
  });

  const handleDownloadClick = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        getCsvFile({ ...data, isAdmin: true })
      )}`
    );
    element.setAttribute('download', 'registration-data.csv');
    element.style.display = 'none';
    if (typeof element.download !== 'undefined') {
      // Sbrowser has support - process the download
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  if (!data.groups) {
    return null;
  }
  const activeUserClearance = getActiveUserClearance();

  if (activeUserClearance !== 'admin') {
    router.push('/');
  }

  return (
    <>
      <div className="admin">
        <table name="camperId">
          <tbody>
            <tr className="table-header-row">
              <th className="header-place"></th>
              <th className="header-place">Group Name</th>
              <th className="header-place">Leader</th>
            </tr>

            {data.groups.map((group) => {
              if (group.id !== 1) {
                return (
                  <tr key={group.id} className="table-row">
                    <td className="table-edit">
                      <Link
                        href="/groupEdit"
                        onClick={() => {
                          setActiveGroupId(group.id);
                        }}
                      >
                        Edit
                      </Link>
                    </td>
                    <td className="table-name">{group.group_name}</td>
                    <td className="table-score">{group.leader_name}</td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>

        <h4 className="add-delete-link">
          <Link href="/groupAdd">Add a Group</Link>
        </h4>

        <h4 className="add-delete-link">
          <Link href="/userAdd">Add a User</Link>
        </h4>

        <h4 className="add-delete-link">
          <Link href="/users">View All Users</Link>
        </h4>

        <h4 className="add-delete-link">
          <button onClick={handleDownloadClick} type="button">
            Download All Data
          </button>
        </h4>
      </div>
    </>
  );
};

export default Admin;
