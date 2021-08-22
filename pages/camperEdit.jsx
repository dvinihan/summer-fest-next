import React, { useEffect, useState } from 'react';
import Error from './Error';
import { Redirect } from 'react-router-dom';
import {
  deleteCamper,
  downloadCovidImage,
  editCamper,
} from '../services/camper-service';
import {
  getActiveUserClearance,
  getActiveGroupId,
  getActiveCamperId,
} from '../helpers';
import './CamperForm.css';
import ImageViewer from 'react-simple-image-viewer';
import Camper from './models/Camper';

const CamperEdit = () => {
  const [showFileTypeError, setShowFileTypeError] = useState(false);
  const [isViewerOpenCurrentPic, setIsViewerOpenCurrentPic] = useState(false);
  const [isViewerOpenNewPic, setIsViewerOpenNewPic] = useState(false);
  const [camper, setCamper] = useState(new Camper());
  const [campers, setCampers] = useState([]);
  const [currentCovidImage, setCurrentCovidImage] = useState();
  const [newCovidImage, setNewCovidImage] = useState();
  const [groups, setGroups] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    fetch('/allData')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error();
      })
      .then((data) => {
        const camperData = data.campers.find(
          (c) => String(c.id) === getActiveCamperId()
        );

        if (camperData.covid_image_file_name) {
          downloadCovidImage(camperData.covid_image_file_name).then((res) => {
            const image = `data:image/jpeg;base64,${res.encodedImage}`;
            setGroups(data.groups);
            setCamper(camperData);
            setCurrentCovidImage(image);
          });
        } else {
          setGroups(data.groups);
          setCamper(camperData);
        }
      })
      .catch(() => null);
  });

  const handleDeleteCamper = (id, groupId) => {
    deleteCamper(id, groupId).then((response) => {
      if (response.error) {
        setError(true);
      } else {
        setShouldRedirect(response.shouldRedirect);
      }
    });
  };

  const handleEditCamper = () => {
    editCamper(
      camper.id,
      camper.first_name,
      camper.last_name,
      camper.gender,
      camper.birthday,
      camper.grade_completed,
      camper.allergies,
      camper.parent_email,
      camper.emergency_name,
      camper.emergency_number,
      camper.roommate,
      camper.notes,
      camper.registration,
      camper.signed_status,
      camper.signed_by,
      camper.room,
      camper.adult_leader,
      camper.student_leadership_track,
      camper.camp_attending,
      camper.covid_image_type,
      camper.new_covid_image,
      camper.covid_image_file_name
    ).then((response) => {
      if (response.error) {
        setError(true);
      } else if (groups) {
        setShouldRedirect(response.shouldRedirect);
        setCampers(response.campers);
      }
    });
  };

  const handleChange = (e) => {
    setCamper({ ...camper, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    if (e.target.files[0].type !== 'image/jpeg') {
      setShowFileTypeError(true);
      return;
    }
    setShowFileTypeError(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewCovidImage(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  if (!groups || !campers) {
    return null;
  }

  const activeUserClearance = getActiveUserClearance();
  const groupId = getActiveGroupId();
  const camperId = getActiveCamperId();

  const group = groups.find((g) => String(g.id) === groupId);
  const currentCamper = campers.find((c) => String(c.id) === camperId);

  if (shouldRedirect) {
    return (
      <Redirect
        to={{
          pathname: '/groupEdit',
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

  return !group || !currentCamper ? (
    <Error />
  ) : (
    <>
      <div className="camper-form">
        <h3>First Name:</h3>
        <input
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.first_name}
          name="first_name"
        />
        <br />
        <h3>Last Name:</h3>
        <input
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.last_name}
          name="last_name"
        />
        <br />
        <h3>Gender:</h3>
        <select
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.gender}
          name="gender"
        >
          <option value="null">{null}</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <br />
        <h3>Birthday:</h3>
        <input
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.birthday}
          name="birthday"
        />
        <br />
        <h3>Grade just completed:</h3>
        <select
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.grade_completed}
          name="grade_completed"
        >
          <option value="null">{null}</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <br />
        <h3>Food Allergies:</h3>
        <input
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.allergies}
          name="allergies"
        />
        <br />
        <h3>Parent or Guardian Email:</h3>
        <input
          type="email"
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.parent_email}
          name="parent_email"
        />
        <br />
        <h3>Emergency Contact Name:</h3>
        <input
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.emergency_name}
          name="emergency_name"
        />
        <br />
        <h3>Emergency Contact Number:</h3>
        <input
          type="tel"
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.emergency_number}
          name="emergency_number"
        />
        <br />
        <h3>Roommate:</h3>
        <input
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.roommate}
          name="roommate"
        />
        <br />
        <h3>Notes:</h3>
        <textarea
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.notes}
          name="notes"
        />
        <br />
        <h3>Online or Paper Registration:</h3>
        <select
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.registration}
          name="registration"
        >
          <option value="null">{null}</option>
          <option value="Online">Online</option>
          <option value="Paper">Paper</option>
        </select>
        <br />
        <h3>Waiver Signed Status:</h3>
        <select
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.signed_status}
          name="signed_status"
        >
          <option value="null">{null}</option>
          <option value="Not Sent">Not Sent</option>
          <option value="Emailed">Emailed</option>
          <option value="Signed">Signed</option>
        </select>
        <br />
        {activeUserClearance === 'admin' && (
          <>
            <h3>Room Assignment:</h3>
            <input
              onChange={handleChange}
              className="camper-input"
              defaultValue={camper.room}
              name="room"
            />
            <br />
          </>
        )}
        <h3>Is this person an adult leader?</h3>
        <select
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.adult_leader}
          name="adult_leader"
        >
          <option value="null">{null}</option>
          <option value="Yes">Yes</option>
        </select>
        <br />
        <h3>Student Leadership Track?</h3>
        <select
          onChange={handleChange}
          className="camper-input"
          defaultValue={camper.student_leadership_track}
          name="student_leadership_track"
        >
          <option value="null">{null}</option>
          <option value="Yes">Yes</option>
        </select>
        <h3>Camp Attending</h3>
        <select
          onChange={handleChange}
          className="camper-input"
          name="camp_attending"
          defaultValue={camper.camp_attending}
        >
          <option value="null">{null}</option>
          <option value="Middle School Camp">Middle School Camp</option>
          <option value="High School Camp">High School Camp</option>
        </select>
        <br />
        <h3>COVID Image Type</h3>
        <select
          onChange={handleChange}
          className="camper-input"
          name="covid_image_type"
        >
          <option value="null">{null}</option>
          <option value="Negative Test">Negative Test</option>
          <option value="Proof of Vaccine">Proof of Vaccine</option>
        </select>
        <br />
        <h3>COVID Image</h3>
        <p>Current file: {camper.covid_image_file_name}</p>
        <button type="button" onClick={() => setIsViewerOpenCurrentPic(true)}>
          <img
            alt="Current Covid document"
            src={currentCovidImage}
            width="300px"
          />
        </button>
        {isViewerOpenCurrentPic && (
          <ImageViewer
            src={[currentCovidImage]}
            currentIndex={0}
            onClose={() => setIsViewerOpenCurrentPic(false)}
            backgroundStyle={{
              backgroundColor: 'rgba(0,0,0,0.9)',
            }}
          />
        )}

        <input
          style={{ marginTop: '15px' }}
          onChange={handleImageUpload}
          type="file"
          id="covid_file"
          name="covid_file"
          accept="image/jpeg"
        />
        {showFileTypeError && (
          <p className="camper-input-error">
            Only JPG image files are supported
          </p>
        )}

        <button type="button" onClick={() => setIsViewerOpenNewPic(true)}>
          <img alt="New covid document" src={newCovidImage} width="300px" />
        </button>
        {isViewerOpenNewPic && (
          <ImageViewer
            src={[newCovidImage]}
            currentIndex={0}
            onClose={() => setIsViewerOpenNewPic(false)}
            backgroundStyle={{
              backgroundColor: 'rgba(0,0,0,0.9)',
            }}
          />
        )}

        {showDeleteModal && (
          <div id="delete-camper-modal">
            <h1>
              Are you sure you want to PERMANENTLY delete {camper.first_name}{' '}
              {camper.last_name}?
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
              onClick={() => {
                handleDeleteCamper(camper.id, camper.group_id);
              }}
            >
              Yes
            </button>
          </div>
        )}

        <button
          className="save-camper-button"
          type="button"
          onClick={() => handleEditCamper()}
        >
          Save
        </button>

        <br />
        <br />

        <button
          className="delete-camper-button"
          type="button"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>

        {error && (
          <div id="error">There&apos;s been an error. Please try again.</div>
        )}
      </div>
    </>
  );
};

export default CamperEdit;
