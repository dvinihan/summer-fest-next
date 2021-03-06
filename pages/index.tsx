import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import { PageHeader } from '../src/components/PageHeader';
import { GetServerSidePropsContext } from 'next';
import { getIsAdminFromUser, getUserGroupId } from '../src/helpers';
import { getSession } from '@auth0/nextjs-auth0';
import { User } from '../src/types/User';
import { useNavigate } from '../src/hooks/useNavigate';

type Props = {
  user?: User;
};

const Home = ({ user }: Props) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl">
      <PageHeader />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        sx={{ marginTop: '80px' }}
      >
        {user ? (
          <>
            <Grid item>
              <Paper sx={{ padding: '20px' }}>
                <Typography>Logged in as {user.name}</Typography>
              </Paper>
            </Grid>
            <Grid item>
              {user.user_metadata?.group_id ? (
                <Button
                  onClick={() =>
                    navigate(`/groupEdit?id=${user.user_metadata.group_id}`)
                  }
                >
                  Edit Group {user.user_metadata.group_id}
                </Button>
              ) : (
                <Paper sx={{ padding: '20px' }}>
                  <Typography>
                    You are not associated with any groups.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </>
        ) : (
          <Grid item>
            <Button
              variant="contained"
              onClick={() => navigate('/api/auth/login')}
            >
              Log In
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { user } = getSession(context.req, context.res) ?? {};
  const isAdmin = getIsAdminFromUser(user);

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
    props: user
      ? {
          user,
        }
      : {},
  };
};

export default Home;
