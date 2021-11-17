import { useState } from 'react';
import { User } from '../src/types/User';
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
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withAdmin } from '../src/components/withAdmin';
import { GetServerSidePropsContext } from 'next';
import { getIsAdminFromContext } from '../src/helpers';
import { PageHeader } from '../src/components/PageHeader';
import { useMakeMutationOptions } from '../src/hooks/useMakeMutationOptions';

const UserAdd = () => {
  const theme = useTheme();
  const [user, setUser] = useState(new User());
  const makeMutationOptions = useMakeMutationOptions();

  const addUserMutation = useMutation(
    async () => await axios.post('/api/addUser', user),
    makeMutationOptions({ successNavPath: '/admin' })
  );

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <PageHeader />
      <Paper sx={{ padding: theme.spacing(2), marginTop: '80px' }}>
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
                    value={user.name}
                    name="name"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Email"
                    onChange={handleChange}
                    value={user.email}
                    name="email"
                  />
                </Grid>
                <Grid item>
                  {/* <Grid item> */}
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    onChange={handleChange}
                    value={user.status}
                    name="status"
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Leader">Leader</MenuItem>
                  </Select>
                  {/* </Grid> */}
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
                  <Button variant="contained" onClick={addUserMutation.mutate}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </Container>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    return {
      props: {
        isAdmin: getIsAdminFromContext(context),
      },
    };
  },
});

export default withAdmin(UserAdd);
