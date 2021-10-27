import React, { useEffect, useState } from 'react';
import { getActiveUserClearance } from '../helpers';
import User from '../models/User';
import { useMutation } from 'react-query';
import axios from 'axios';
import {
  Button,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';

const UserAdd = () => {
  const router = useRouter();
  const theme = useTheme();
  const [user, setUser] = useState(new User());

  const addUserMutation = useMutation(async () => {
    await axios.post('/api/addUser', user);
  });

  useEffect(() => {
    if (addUserMutation.isSuccess) {
      router.push('/admin');
    }
  });

  const handleChange = (e) => {
    console.log(e);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    addUserMutation.mutate();
  };

  const activeUserClearance = getActiveUserClearance();

  // if (activeUserClearance !== 'admin') {
  //   return (
  //     <Redirect
  //       to={{
  //         pathname: '/'
  //       }}
  //     />
  //   );
  // }

  return (
    <Paper sx={{ padding: theme.spacing(2) }}>
      <Container>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={4}
            >
              <Grid item>
                <TextField
                  label="Username"
                  onChange={handleChange}
                  value={user.username}
                  name="username"
                />
              </Grid>
              <Grid item>
                <Grid item>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    onChange={handleChange}
                    value={user.status}
                    name="status"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="leader">Leader</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default UserAdd;
