import React from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { downloadCSV } from '../src/helpers/downloadCSV';
import Group from '../src/types/Group';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetServerSidePropsContext } from 'next';
import { PageHeader } from '../src/components/PageHeader';
import AdminError from '../src/components/AdminError';
import { fetchCampersInGroup } from '../src/queries/campers';
import { fetchGroupsById } from '../src/queries/groups';
import Camper from '../src/types/Camper';
import { getIsAdmin } from '../src/helpers';
import { fetchUserRoles } from '../src/queries/users';

type Props = {
  isAdmin: boolean;
  campers: Camper[];
  groups: Group[];
};

const Admin = ({ isAdmin, campers = [], groups = [] }: Props) => {
  if (!isAdmin) {
    return <AdminError />;
  }

  const router = useRouter();
  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      <PageHeader isAdmin={isAdmin} />
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Group Name</TableCell>
                  <TableCell>Leader</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {groups.map((group: Group) =>
                  group.id === 1 ? null : (
                    <TableRow key={group.id}>
                      <TableCell>
                        <Link href={`/groupEdit?id=${group.id}`}>Edit</Link>
                      </TableCell>
                      <TableCell>{group.group_name}</TableCell>
                      <TableCell>{group.leader_name}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Button onClick={() => router.push('/groupAdd')}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                  <Container>Add a Group</Container>
                </Paper>
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => router.push('/userAdd')}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                  <Container>Add a User</Container>
                </Paper>
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => router.push('/users')}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                  <Container>View All Users</Container>
                </Paper>
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Button
            onClick={() => downloadCSV({ groups, campers, isAdmin: true })}
            type="button"
          >
            <Paper sx={{ padding: theme.spacing(1) }}>
              <Container>Download All Data</Container>
            </Paper>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    const sessionCookie = context.req.headers.cookie;
    const userRoles = await fetchUserRoles({
      sessionCookie,
    });
    const isAdmin = getIsAdmin(userRoles);

    if (!isAdmin) {
      return {
        props: {
          isAdmin,
        },
      };
    }

    const [campers, groups] = await Promise.all([
      fetchCampersInGroup({
        sessionCookie,
      }),
      fetchGroupsById({
        sessionCookie,
      }),
    ]);

    return {
      props: {
        isAdmin,
        campers,
        groups,
      },
    };
  },
});

export default Admin;
