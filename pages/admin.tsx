import React from 'react';
import { useRouter } from 'next/router';
import { getActiveUserClearance } from '../helpers';
import getCsvFile from '../helpers/getCsvFile';
import Camper from '../models/Camper';
import Group from '../models/Group';
import User from '../models/User';
import {
  Button,
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

interface Props {
  campers: Camper[];
  groups: Group[];
  users: User[];
}

const Admin = ({ campers = [], groups = [], users = [] }: Props) => {
  const router = useRouter();

  const handleDownloadClick = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        getCsvFile({ groups, campers, users, isAdmin: true })
      )}`
    );
    element.setAttribute('download', 'registration-data.csv');
    element.style.display = 'none';
    if (typeof element.download !== 'undefined') {
      // browser has support - process the download
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // const activeUserClearance = getActiveUserClearance();
  // if (typeof window !== 'undefined' && activeUserClearance !== 'admin') {
  //   router.replace('/');
  //   return null;
  // }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
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
              {groups.map((group) =>
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
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Link href="/groupAdd">Add a Group</Link>
          </Grid>
          <Grid item>
            <Link href="/userAdd">Add a User</Link>
          </Grid>
          <Grid item>
            <Link href="/users">View All Users</Link>
          </Grid>
          <Grid item>
            <Button onClick={handleDownloadClick} type="button">
              Download All Data
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export async function getStaticProps() {
  const { BASE_URL } = process.env;

  const res = await fetch(`${BASE_URL}/api/allData`);
  const json = await res.json();

  return {
    props: json,
  };
}

export default Admin;
