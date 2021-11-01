import { useState } from 'react';
import { getActiveUserClearance } from '../helpers';
import Camper from '../types/Camper';
import {
  Button,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextareaAutosize,
  TextField,
  useTheme,
} from '@mui/material';
import DeleteModal from './DeleteModal';
import CovidImages from './CovidImages';

interface Props {
  initialCamper: Camper;
  onSave: ({ camper }: { camper: Camper }) => void;
  onDeleteCamper?: () => void;
}

const CamperForm = ({ initialCamper, onSave, onDeleteCamper }: Props) => {
  const theme = useTheme();

  const [camper, setCamper] = useState(initialCamper);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [covidImage, setCovidImage] = useState('');

  const activeUserClearance = getActiveUserClearance();

  const handleChange = (e) => {
    setCamper({ ...camper, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    onDeleteCamper();
    setShowDeleteModal(false);
  };

  const handleSave = () =>
    onSave({ camper: { ...camper, covid_image: covidImage } });

  return (
    <Container maxWidth="xl">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <Paper sx={{ padding: theme.spacing(2) }}>
            <Grid container spacing={4}>
              <Grid item>
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
                      InputLabelProps={{ sx: { fontSize: '0.9rem' } }}
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
                      <MenuItem value="Middle School Camp">
                        Middle School Camp
                      </MenuItem>
                      <MenuItem value="High School Camp">
                        High School Camp
                      </MenuItem>
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
                      <MenuItem value="Proof of Vaccine">
                        Proof of Vaccine
                      </MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <CovidImages
                  oldImageFileName={initialCamper.covid_image_file_name}
                  newImageFileName={camper.covid_image_file_name}
                  setImage={setCovidImage}
                  isEditingCamper={Boolean(onDeleteCamper)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Button onClick={handleSave}>
                <Paper sx={{ padding: theme.spacing(1) }}>Save</Paper>
              </Button>
            </Grid>
            {onDeleteCamper && (
              <Grid item>
                <Button onClick={() => setShowDeleteModal(true)}>
                  <Paper sx={{ padding: theme.spacing(1) }}>Delete</Paper>
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {showDeleteModal && (
        <DeleteModal
          message={`Are you sure you want to PERMANENTLY delete ${camper.first_name} ${camper.last_name}?`}
          onAccept={handleDelete}
          onDecline={() => setShowDeleteModal(false)}
        />
      )}
    </Container>
  );
};

export default CamperForm;
