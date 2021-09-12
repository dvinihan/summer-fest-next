import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getActiveUserClearance } from '../helpers';
import Camper from '../models/Camper';
import User from '../models/User';
import GroupForm from '../components/GroupForm';
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
import UserError from '../components/FormError';
import { NextPageContext } from 'next';
import getQueryParamId from '../helpers/getQueryParamId';
import { useDownloadCovidImage } from '../queries/images';
import {
  useEditGroup,
  useDeleteGroup,
  fetchGroupsById,
} from '../queries/groups';
import handleDownload from '../helpers/downloadCSV';
import downloadImage from '../helpers/downloadImage';
import Loading from '../components/Loading';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { fetchCampersInGroup } from '../queries/campers';
import { fetchGroupUsers } from '../queries/users';
import PageError from '../components/PageError';
import Group from '../models/Group';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  group: Group;
}

const useStyles = makeStyles((theme: any) => ({
  button: {
    padding: theme.spacing(1),
  },
  wideCell: {
    minWidth: 300,
  },
}));

const GroupEdit = ({ group }: Props) => {
  const router = useRouter();
  const classes = useStyles();

  const { data: campers = [] } = useQuery('campersInGroup', () =>
    fetchCampersInGroup(group.id)
  );
  const { data: users = [] } = useQuery('groupUsers', () =>
    fetchGroupUsers(group.id)
  );
  // there should only be one user with this groupId
  const groupUser = users[0];

  const activeUserClearance = getActiveUserClearance();

  const editGroupMutation = useEditGroup();
  const deleteGroupMutation = useDeleteGroup();
  const downloadCovidImageMutation = useDownloadCovidImage();

  useEffect(() => {
    if (editGroupMutation.isSuccess || deleteGroupMutation.isSuccess) {
      router.push(`/admin`);
    }
  });

  const handleDownloadCovidImage = (covidFileName: string) => {
    downloadCovidImageMutation.mutate(covidFileName);

    const axiosResponse = downloadCovidImageMutation.data;
    downloadImage(covidFileName, axiosResponse.data);
  };

  //   if (shouldRedirect) {
  //     return (
  //       <Redirect
  //         to={{
  //           pathname: '/admin',
  //         }}
  //       />
  //     );
  //   }

  //   if (!activeUserClearance) {
  //     return (
  //       <Redirect
  //         to={{
  //           pathname: '/',
  //         }}
  //       />
  //     );
  //   }

  return (
    <Container>
      {(!editGroupMutation.isIdle || !deleteGroupMutation.isIdle) && (
        <Loading isOpen />
      )}

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <GroupForm
            initialGroup={group}
            onDeleteGroup={deleteGroupMutation.mutate}
            onSave={editGroupMutation.mutate}
            groupUser={groupUser}
          />
        </Grid>

        {(editGroupMutation.isError || deleteGroupMutation.isError) && (
          <UserError />
        )}

        <Grid item>
          <h1>Campers</h1>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Birthday</TableCell>
                <TableCell>Grade just completed</TableCell>
                <TableCell>Food Alergies</TableCell>
                <TableCell>Parent or Guardian Email</TableCell>
                <TableCell>Emergency Contact Name</TableCell>
                <TableCell>Emergency Contact Number</TableCell>
                <TableCell>Roommate</TableCell>
                <TableCell>Online or Paper Registration</TableCell>
                <TableCell>Waiver Signed Status</TableCell>
                <TableCell>Waiver Signed By</TableCell>
                {activeUserClearance === 'admin' && (
                  <TableCell>Room Assignment</TableCell>
                )}
                <TableCell>Is Adult Leader</TableCell>
                <TableCell>Student Leadership Track</TableCell>
                <TableCell>Camp Attending</TableCell>
                <TableCell>COVID Image Type</TableCell>
                <TableCell>COVID Image</TableCell>
                <TableCell className={classes.wideCell}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campers.map((camper: Camper) => (
                <TableRow key={camper.id}>
                  <TableCell>
                    <Link href={`/camperEdit?id=${camper.id}`}>Edit</Link>
                  </TableCell>
                  <TableCell>{camper.first_name}</TableCell>
                  <TableCell>{camper.last_name}</TableCell>
                  <TableCell>{camper.gender}</TableCell>
                  <TableCell>{camper.birthday}</TableCell>
                  <TableCell>{camper.grade_completed}</TableCell>
                  <TableCell>{camper.allergies}</TableCell>
                  <TableCell>{camper.parent_email}</TableCell>
                  <TableCell>{camper.emergency_name}</TableCell>
                  <TableCell>{camper.emergency_number}</TableCell>
                  <TableCell>{camper.roommate}</TableCell>

                  <TableCell>{camper.registration}</TableCell>
                  <TableCell>{camper.signed_status}</TableCell>
                  <TableCell>{camper.signed_by}</TableCell>
                  {activeUserClearance === 'admin' && (
                    <TableCell>{camper.room}</TableCell>
                  )}
                  <TableCell>{camper.adult_leader}</TableCell>
                  <TableCell>{camper.student_leadership_track}</TableCell>
                  <TableCell>{camper.camp_attending}</TableCell>
                  <TableCell>{camper.covid_image_type}</TableCell>
                  <TableCell>
                    {camper.covid_image_file_name && (
                      <Button
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          handleDownloadCovidImage(camper.covid_image_file_name)
                        }
                      >
                        Download
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className={classes.wideCell}>
                    {camper.notes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid item>
          <Button onClick={() => router.push(`/camperAdd?groupId=${group.id}`)}>
            <Paper className={classes.button}>
              <Container>Add a Camper</Container>
            </Paper>
          </Button>
        </Grid>

        <Grid item>
          <Button onClick={() => handleDownload({ campers })}>
            <Paper className={classes.button}>
              <Container>
                Download an Excel file with all your campers
              </Container>
            </Paper>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const GroupEditContainer = () => {
  const router = useRouter();
  const groupId = getQueryParamId(router.query.id);

  if (!groupId) {
    return <PageError />;
  }

  const { data: groups = [] } = useQuery('groups', () =>
    fetchGroupsById(groupId)
  );

  // there should only be one group with this id
  const group = groups[0];

  if (!group) {
    return <PageError />;
  }

  return <GroupEdit group={group} />;
};

export const getServerSideProps = async (context: NextPageContext) => {
  const queryClient = new QueryClient();

  const groupId = getQueryParamId(context.query.id);

  if (groupId) {
    await queryClient.prefetchQuery('groups', () => fetchGroupsById(groupId));
    await queryClient.prefetchQuery('campersInGroup', () =>
      fetchCampersInGroup(groupId)
    );
    await queryClient.prefetchQuery('groupUsers', () =>
      fetchGroupUsers(groupId)
    );
  }

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default GroupEditContainer;
