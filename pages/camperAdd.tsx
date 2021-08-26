import React, { useState } from 'react';
// import { addCamper } from '../services/camper-service';
import ImageViewer from 'react-simple-image-viewer';
import { getActiveUserClearance } from '../helpers';
import Camper from '../models/Camper';
import { useRouter } from 'next/router';

const CamperAdd = () => {
  const router = useRouter();
  const groupId = router.query.groupId;

  const [showFileTypeError, setShowFileTypeError] = useState(false);
  const [camper, setCamper] = useState(
    new Camper({ signed_status: 'Not Sent' })
  );
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleChange = (e) => {
    const newCamper = new Camper({
      ...camper,
      [e.target.name]: e.target.value,
    });
    setCamper(newCamper);
  };

  const handleImageUpload = (e) => {
    if (e.target.files[0].type !== 'image/jpeg') {
      setShowFileTypeError(true);
      return;
    }

    setShowFileTypeError(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newCamper = { ...camper, covid_image: reader.result };
      setCamper(newCamper);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const activeUserClearance = getActiveUserClearance();

  const handleAddCamper = () => {
    addCamper(
      activeGroupId,
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
      camper.covid_image
    ).then((response) => {
      if (response.error) {
        setError(true);
      } else {
        setShouldRedirect(true);
      }
    });
  };

  // if (shouldRedirect) {
  //   return (
  //     <Redirect
  //       to={{
  //         pathname: '/groupEdit',
  //       }}
  //     />
  //   );
  // }

  // if (!activeUserClearance) {
  //   return (
  //     <Redirect
  //       to={{
  //         pathname: '/',
  //       }}
  //     />
  //   );
  // }

  return !activeGroupId ? (
    <Error />
  ) : (
    <>
      <div className="camper-form">
        <h3>First Name:</h3>
        <input
          onChange={handleChange}
          className="camper-input"
          name="first_name"
        />
        <br />
        <h3>Last Name:</h3>
        <input
          onChange={handleChange}
          className="camper-input"
          name="last_name"
        />
        <br />
        <h3>Gender:</h3>
        <select onChange={handleChange} className="camper-input" name="gender">
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
          name="birthday"
        />
        <br />
        <h3>Grade just completed:</h3>
        <select
          onChange={handleChange}
          className="camper-input"
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
          name="allergies"
        />
        <br />
        <h3>Parent or Guardian Email:</h3>
        <input
          type="email"
          onChange={handleChange}
          className="camper-input"
          name="parent_email"
        />
        <br />
        <h3>Emergency Contact Name:</h3>
        <input
          onChange={handleChange}
          className="camper-input"
          name="emergency_name"
        />
        <br />
        <h3>Emergency Contact Number:</h3>
        <input
          type="tel"
          onChange={handleChange}
          className="camper-input"
          name="emergency_number"
        />
        <br />
        <h3>Roommate:</h3>
        <input
          onChange={handleChange}
          className="camper-input"
          name="roommate"
        />
        <br />
        <h3>Notes:</h3>
        <textarea
          onChange={handleChange}
          className="camper-input"
          name="notes"
        />
        <br />
        <h3>Online or Paper Registration:</h3>
        <select
          onChange={handleChange}
          className="camper-input"
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
          name="signed_status"
        >
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
              name="room"
            />
            <br />
          </>
        )}
        <h3>Is this person an adult leader?</h3>
        <select
          onChange={handleChange}
          className="camper-input"
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
          name="student_leadership_track"
        >
          <option value="null">{null}</option>
          <option value="Yes">Yes</option>
        </select>
        <br />
        <h3>Camp Attending</h3>
        <select
          onChange={handleChange}
          className="camper-input"
          name="camp_attending"
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
        <input
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
        <button type="button" onClick={() => setIsViewerOpen(true)}>
          <img src={camper.covid_image} alt="Covid document" width="300px" />
        </button>
        {isViewerOpen && (
          <ImageViewer
            src={[camper.covid_image]}
            currentIndex={0}
            onClose={() => setIsViewerOpen(false)}
            backgroundStyle={{
              backgroundColor: 'rgba(0,0,0,0.9)',
            }}
          />
        )}

        <button
          className="save-camper-button"
          onClick={handleAddCamper}
          type="button"
        >
          Save
        </button>
      </div>
      {error && <div>There&apos;s been an error</div>}
    </>
  );
};

export default CamperAdd;
