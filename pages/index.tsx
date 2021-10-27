import React from 'react';
import Link from 'next/link';
import { Button, Container, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/router';
// import { getActiveUserName } from '../helpers/index';

const Home = () => {
  const router = useRouter();
  // const activeUserName = getActiveUserName();

  // if (activeUserName) {
  //   return null;
  // }

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="center" alignItems="center" spacing={3}>
        <Grid item>
          <Button variant="contained" onClick={() => handleNavigate('/login')}>
            Log In
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => handleNavigate('/signup')}>
            New User?
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
