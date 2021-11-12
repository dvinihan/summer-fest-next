import React from 'react';
import { Button, Container, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { PageHeader } from '../src/components/PageHeader';
import { GetServerSidePropsContext } from 'next';
import { getIsAdminFromContext, getUserGroupId } from '../src/helpers';
import { getSession } from '@auth0/nextjs-auth0';

const Home = () => {
  const router = useRouter();

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

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const isAdmin = getIsAdminFromContext(context);

  if (isAdmin) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const groupId = getUserGroupId(context);
  if (groupId) {
    return {
      redirect: {
        destination: `/groupEdit?id=${groupId}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Home;
