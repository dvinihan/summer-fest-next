import React, { Component, useEffect, useState } from 'react';
import Error from './Error';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { deleteGroup, editGroup } from '../services/group-service';
import {
  getActiveGroupId,
  getActiveUserClearance,
  setActiveCamperId,
} from '../helpers';
import './GroupEdit.css';
import { getCsvFile } from '../helpers/download-helper';
import { downloadCovidImage } from '../services/camper-service';

const GroupEdit = () => {
  const [group, setGroup] = useState();
  const [groups, setGroups] = useState([]);
  const [campers, setCampers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const activeGroupId = getActiveGroupId();
  const activeUserClearance = getActiveUserClearance();

  useEffect(() => {
    fetch('/allData')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error();
      })
      .then((data) => {
        const currentGroup = data.groups.find(
          (g) => String(g.id) === getActiveGroupId()
        );
        setGroup(currentGroup);
      })
      .catch(() => null);
  });

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  const handleDeleteGroup = (id) => {
    deleteGroup(id).then((response) => {
      if (response.error) {
        setError(true);
      } else {
        setShouldRedirect(response.shouldRedirect);
      }
    });
  };

  const handleEditGroup = () => {
    editGroup(activeGroupId, group.group_name, group.leader_name).then(
      (response) => {
        if (response.error) {
          setError(true);
        } else {
          setShouldRedirect(response.shouldRedirect);
        }
      }
    );
  };

  const handleDownloadClick = () => {
    const element = document.createElement('a');
    const campersInThisGroup = campers.filter(
      (camper) => String(camper.group_id) === activeGroupId
    );
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8${encodeURIComponent(
        getCsvFile({ campers: campersInThisGroup })
      )}`
    );
    element.setAttribute('download', 'registration-data.csv');
    element.style.display = 'none';
    if (typeof element.download !== 'undefined') {
      // browser has support - process the download
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const downloadImage = (covidFileName) => {
    downloadCovidImage(covidFileName).then((res) => {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${res.encodedImage}`;
      link.download = covidFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  if (!groups || !campers || !users) {
    return null;
  }

  if (shouldRedirect) {
    return (
      <Redirect
        to={{
          pathname: '/admin',
        }}
      />
    );
  }

  if (!activeUserClearance) {
    return (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    );
  }

  if (!activeGroupId) {
    return <Error />;
  }
  const campersInThisGroup = campers.filter(
    (camper) => String(camper.group_id) === activeGroupId
  );
  const activeGroup = groups.find((g) => String(g.id) === activeGroupId);
  return (
    <>
      <div className="group-edit">
        <div className="info-container">
          <div className="name-title">Group Name:</div>
          <input
            onChange={handleChange}
            defaultValue={activeGroup.group_name}
            name="group_name"
          />
          <div className="name-title">Leader Name:</div>
          <input
            onChange={handleChange}
            defaultValue={activeGroup.leader_name}
            name="leader_name"
          />
        </div>

        {showDeleteModal && (
          <div id="delete-group-modal">
            <h1>
              Are you sure you want to PERMANENTLY delete{' '}
              {activeGroup.group_name} and all its campers
              {users.find((user) => user.group_id === activeGroup.id) && (
                <span>
                  , along with the user{' '}
                  {
                    users.find((user) => user.group_id === activeGroup.id)
                      .username
                  }
                </span>
              )}
              ?
            </h1>
            <button
              className="no-yes-button"
              type="button"
              onClick={() => setShowDeleteModal(false)}
            >
              No
            </button>
            <button
              className="no-yes-button"
              type="button"
              onClick={() => handleDeleteGroup(activeGroupId)}
            >
              Yes
            </button>
          </div>
        )}

        {error && (
          <div id="error">There&apos;s been an error. Please try again.</div>
        )}

        <div className="campers-table-title">Campers</div>
        <button onClick={() => handleEditGroup()} type="submit">
          Save
        </button>

        <Link
          to={{
            pathname: '/camperAdd',
          }}
          className="add-camper-button"
        >
          Add a Camper
        </Link>

        {activeUserClearance === 'admin' && (
          <button type="button" onClick={() => setShowDeleteModal(true)}>
            Delete
          </button>
        )}
        <table name="camperId">
          <tbody>
            <tr className="table-header-row">
              <th className="header-place"></th>
              <th className="header-place">First Name</th>
              <th className="header-name">Last Name</th>
              <th className="header-name">Gender</th>
              <th className="header-name">Birthday</th>
              <th className="header-name">Grade just completed</th>
              <th className="header-name">Food Alergies</th>
              <th className="header-name">Parent or Guardian Email</th>
              <th className="header-name">Emergency Contact Name</th>
              <th className="header-name">Emergency Contact Number</th>
              <th className="header-name">Roommate</th>
              <th className="header-name">Notes</th>
              <th className="header-name">Online or Paper Registration</th>
              <th className="header-name">Waiver Signed Status</th>
              <th className="header-name">Waiver Signed By</th>
              {activeUserClearance === 'admin' && (
                <th className="header-name">Room Assignment</th>
              )}
              <th className="header-name">Is Adult Leader</th>
              <th className="header-name">Student Leadership Track</th>
              <th className="header-name">Camp Attending</th>
              <th className="header-name">COVID Image Type</th>
              <th className="header-name">COVID Image</th>
            </tr>

            {campersInThisGroup.map((camper) => (
              <tr key={camper.id} className="table-row">
                <td className="table-edit">
                  <Link
                    to={{
                      pathname: '/camperEdit',
                    }}
                    onClick={() => setActiveCamperId(camper.id)}
                  >
                    Edit
                  </Link>
                </td>
                <td>{camper.first_name}</td>
                <td>{camper.last_name}</td>
                <td>{camper.gender}</td>
                <td>{camper.birthday}</td>
                <td>{camper.grade_completed}</td>
                <td>{camper.allergies}</td>
                <td>{camper.parent_email}</td>
                <td>{camper.emergency_name}</td>
                <td>{camper.emergency_number}</td>
                <td>{camper.roommate}</td>
                <td>{camper.notes}</td>
                <td>{camper.registration}</td>
                <td>{camper.signed_status}</td>
                <td>{camper.signed_by}</td>
                {activeUserClearance === 'admin' && <td>{camper.room}</td>}
                <td>{camper.adult_leader}</td>
                <td>{camper.student_leadership_track}</td>
                <td>{camper.camp_attending}</td>
                <td>{camper.covid_image_type}</td>
                <td>
                  {camper.covid_image_file_name && (
                    <button
                      type="button"
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        downloadImage(camper.covid_image_file_name)
                      }
                    >
                      Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className="download-button"
          onClick={handleDownloadClick}
        >
          Click here to download an Excel file with all your campers
        </button>
      </div>
    </>
  );
};

export default GroupEdit;
