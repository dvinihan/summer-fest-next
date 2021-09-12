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
} from '@material-ui/core';
import handleDownload from '../helpers/downloadCSV';
import { QueryClient, useQuery } from 'react-query';
import { fetchAllData } from '../queries/allData';
import { dehydrate } from 'react-query/hydration';
import Group from '../models/Group';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: any) => ({
  button: {
    padding: theme.spacing(1),
  },
}));

const Admin = () => {
  const router = useRouter();
  const classes = useStyles();

  const allDataQuery = useQuery('allData', () => fetchAllData());
  const { campers, groups, users } = allDataQuery.data;

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
        spacing={4}
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
                <Paper className={classes.button}>
                  <Container>Add a Group</Container>
                </Paper>
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => router.push('/userAdd')}>
                <Paper className={classes.button}>
                  <Container>Add a User</Container>
                </Paper>
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => router.push('/users')}>
                <Paper className={classes.button}>
                  <Container>View All Users</Container>
                </Paper>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <Button
              onClick={() =>
                handleDownload({ groups, campers, users, isAdmin: true })
              }
              type="button"
            >
              <Paper className={classes.button}>
                <Container>Download All Data</Container>
              </Paper>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('allData', () => fetchAllData());

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}

export default Admin;
