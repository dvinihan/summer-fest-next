import React, { useEffect } from 'react';
import { Button, Container, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useAdmin } from '../src/hooks/useAdmin';
import { PageHeader } from '../src/components/PageHeader';

const Home = () => {
  const router = useRouter();

  const { user, isAdmin } = useAdmin();

  useEffect(() => {
    if (user) {
      const redirectPath = isAdmin ? '/admin' : '/groupEdit';
      router.push(redirectPath);
    }
  });

  const handleLogin = () => {
    router.push('/api/auth/login');
  };

  return (
    <Container maxWidth="xl">
      <PageHeader />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <div style={{ height: '60px' }}></div>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleLogin}>
            Log In
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
