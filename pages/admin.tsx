import React from 'react';
import { useRouter } from 'next/router';
import { getActiveUserClearance } from '../helpers';
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
import handleDownload from '../helpers/downloadCSV';
import { QueryClient, useQuery } from 'react-query';
import { fetchAllData } from '../queries/allData';
import { dehydrate } from 'react-query/hydration';
import Group from '../models/Group';

const Admin = () => {
  const router = useRouter();
  const theme = useTheme();

  const { data } = useQuery('allData', fetchAllData);
  const { campers, groups, users } = data;

  // const activeUserClearance = getActiveUserClearance();
  // if (typeof window !== 'undefined' && activeUserClearance !== 'admin') {
  //   router.replace('/');
  //   return null;
  // }

  return (
    <Container maxWidth="xl">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
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
            onClick={() =>
              handleDownload({ groups, campers, users, isAdmin: true })
            }
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

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('allData', fetchAllData);

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}

export default Admin;
