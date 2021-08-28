import { useEffect, useState } from 'react';
import { getActiveUserClearance } from '../helpers';
import Camper from '../models/Camper';
import ImageViewer from 'react-simple-image-viewer';
import axios from 'axios';
import {
  Button,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextareaAutosize,
  TextField,
} from '@material-ui/core';

interface Props {
  initialCamper?: Camper;
  onSave: (camper: Camper) => void;
  onDeleteCamper?: (camperId: number) => void;
}

const CamperForm = ({ initialCamper, onSave, onDeleteCamper }: Props) => {
  const [camper, setCamper] = useState(initialCamper ?? new Camper());
  const [newCovidImage, setNewCovidImage] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFileTypeError, setShowFileTypeError] = useState(false);
  const [isViewerOpenCurrentPic, setIsViewerOpenCurrentPic] = useState(false);
  const [isViewerOpenNewPic, setIsViewerOpenNewPic] = useState(false);
  const [currentCovidImage, setCurrentCovidImage] = useState('');

  useEffect(() => {
    if (initialCamper.covid_image_file_name) {
      axios
        .post('/api/downloadCovidImage', initialCamper.covid_image_file_name)
        .then((res) => {
          const image = `data:image/jpeg;base64,${res.data.encodedImage}`;
          setCurrentCovidImage(image);
        });
    }
  }, []);

  const activeUserClearance = getActiveUserClearance();

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
      // @ts-ignore
      setNewCovidImage(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Container maxWidth="xl">
      <Paper>
        <Grid container spacing={4}>
          <Grid item>
            <TextField
              label="First Name"
              onChange={handleChange}
              value={camper.first_name}
              name="first_name"
            />
          </Grid>
          <Grid item>
            <TextField
              label="Last Name"
              onChange={handleChange}
              value={camper.last_name}
              name="last_name"
            />
          </Grid>
          <Grid item>
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              onChange={handleChange}
              value={camper.gender}
              name="gender"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <TextField
              label="Birthday"
              onChange={handleChange}
              value={camper.birthday}
              name="birthday"
            />
          </Grid>
          <Grid item>
            <InputLabel>Grade just completed</InputLabel>
            <Select
              onChange={handleChange}
              value={camper.grade_completed}
              name="grade_completed"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="6">6</MenuItem>
              <MenuItem value="7">7</MenuItem>
              <MenuItem value="8">8</MenuItem>
              <MenuItem value="9">9</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="11">11</MenuItem>
              <MenuItem value="12">12</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <TextField
              label="Food Allergies"
              onChange={handleChange}
              value={camper.allergies}
              name="allergies"
            />
          </Grid>
          <Grid item>
            <TextField
              label="Parent or Guardian Email"
              type="email"
              onChange={handleChange}
              value={camper.parent_email}
              name="parent_email"
            />
          </Grid>
          <Grid item>
            <TextField
              label="Emergency Contact Name"
              onChange={handleChange}
              value={camper.emergency_name}
              name="emergency_name"
            />
          </Grid>
          <Grid item>
            <TextField
              label="Emergency Contact Number"
              type="tel"
              onChange={handleChange}
              value={camper.emergency_number}
              name="emergency_number"
            />
          </Grid>
          <Grid item>
            <TextField
              label="Roommate"
              onChange={handleChange}
              value={camper.roommate}
              name="roommate"
            />
          </Grid>
          <Grid item>
            <InputLabel>Notes</InputLabel>
            <TextareaAutosize
              onChange={handleChange}
              value={camper.notes}
              name="notes"
            />
          </Grid>
          <Grid item>
            <InputLabel>Registration</InputLabel>
            <Select
              onChange={handleChange}
              value={camper.registration}
              name="registration"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Paper">Paper</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <InputLabel>Waiver</InputLabel>
            <Select
              onChange={handleChange}
              value={camper.signed_status}
              name="signed_status"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Not Sent">Not Sent</MenuItem>
              <MenuItem value="Emailed">Emailed</MenuItem>
              <MenuItem value="Signed">Signed</MenuItem>
            </Select>
          </Grid>
          {activeUserClearance === 'admin' && (
            <Grid item>
              <TextField
                label="Room Assignment"
                onChange={handleChange}
                value={camper.room}
                name="room"
              />
            </Grid>
          )}
          <Grid item>
            <InputLabel>Is this person an adult leader?</InputLabel>
            <Select
              onChange={handleChange}
              value={camper.adult_leader}
              name="adult_leader"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <InputLabel>Student Leadership track?</InputLabel>
            <Select
              onChange={handleChange}
              value={camper.student_leadership_track}
              name="student_leadership_track"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <InputLabel>Camp Attending</InputLabel>
            <Select
              onChange={handleChange}
              name="camp_attending"
              value={camper.camp_attending}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Middle School Camp">Middle School Camp</MenuItem>
              <MenuItem value="High School Camp">High School Camp</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <InputLabel>COVID Image Type</InputLabel>
            <Select
              onChange={handleChange}
              name="covid_image_type"
              value={camper.covid_image_type}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Negative Test">Negative Test</MenuItem>
              <MenuItem value="Proof of Vaccine">Proof of Vaccine</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <h3>COVID Image</h3>
            <p>Current file: {camper.covid_image_file_name}</p>
            <Button onClick={() => setIsViewerOpenCurrentPic(true)}>
              <img
                alt="Current Covid document"
                src={currentCovidImage}
                width="300px"
              />
            </Button>
          </Grid>
          {isViewerOpenCurrentPic && (
            <Grid item>
              <ImageViewer
                src={[currentCovidImage]}
                currentIndex={0}
                onClose={() => setIsViewerOpenCurrentPic(false)}
                backgroundStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                }}
              />
            </Grid>
          )}
          <Grid item>
            <input
              style={{ marginTop: '15px' }}
              onChange={handleImageUpload}
              type="file"
              name="covid_file"
              accept="image/jpeg"
            />
            {showFileTypeError && (
              <p className="camper-input-error">
                Only JPG image files are supported
              </p>
            )}
          </Grid>
          <Grid item>
            <Button onClick={() => setIsViewerOpenNewPic(true)}>
              <img alt="New covid document" src={newCovidImage} width="300px" />
            </Button>
          </Grid>
          {isViewerOpenNewPic && (
            <Grid item>
              <ImageViewer
                src={[newCovidImage]}
                currentIndex={0}
                onClose={() => setIsViewerOpenNewPic(false)}
                backgroundStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                }}
              />
            </Grid>
          )}
          {showDeleteModal && (
            <Modal open>
              <Paper>
                <h1>
                  Are you sure you want to PERMANENTLY delete{' '}
                  {camper.first_name} {camper.last_name}?
                </h1>
                <Button onClick={() => setShowDeleteModal(false)}>No</Button>
                <Button onClick={() => onDeleteCamper(camper.id)}>Yes</Button>
              </Paper>
            </Modal>
          )}
        </Grid>
      </Paper>
      <Paper>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <Button onClick={() => onSave(camper)}>Save</Button>
          </Grid>
          {onDeleteCamper && (
            <Grid item>
              <Button onClick={() => setShowDeleteModal(true)}>Delete</Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default CamperForm;
