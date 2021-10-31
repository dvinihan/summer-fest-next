import React, { useEffect } from 'react';
import { Button, Container, Grid } from '@mui/material';
import { useRouter } from 'next/router';
// import { getActiveUserName } from '../helpers/index';
import { useUser } from '@auth0/nextjs-auth0';

const Home = () => {
  const router = useRouter();

  const { user } = useUser();
  const isAdmin = user['https://summer-fest.com/isAdmin'];

  console.log(user);

  useEffect(() => {
    // if (user) {
    // }
  });

  // const activeUserName = getActiveUserName();

  // if (activeUserName) {
  //   return null;
  // }

  const handleLogin = () => {
    // loginWithRedirect();
    router.push('/api/auth/login');
  };

  const handleLogout = () => {
    // logout();
    router.push('/api/auth/logout');
  };

  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="center" alignItems="center" spacing={3}>
        <Grid item>
          <Button variant="contained" onClick={handleLogin}>
            Log In
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleLogout}>
            Log Out
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
