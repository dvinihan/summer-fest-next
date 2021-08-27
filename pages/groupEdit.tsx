import React from 'react';
import { useRouter } from 'next/router';
import { getActiveUserClearance } from '../helpers';
import Group from '../models/Group';
import Camper from '../models/Camper';
import User from '../models/User';
import GroupForm from '../components/GroupForm';
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
import UserError from '../components/UserError';
import { NextPageContext } from 'next';
import getQueryParamId from '../helpers/getQueryParamId';
import { useDownloadCovidImage } from '../queries/image';
import { useEditGroup, useDeleteGroup } from '../queries/group';
import handleDownload from '../helpers/downloadCSV';
import downloadImage from '../helpers/downloadImage';
import Loading from '../components/Loading';

interface Props {
  group: Group;
  campers: Camper[];
  groupUser?: User;
}

const GroupEdit = ({ group: initialGroup, campers = [], groupUser }: Props) => {
  const activeUserClearance = getActiveUserClearance();

  const router = useRouter();

  const editGroupMutation = useEditGroup();
  const deleteGroupMutation = useDeleteGroup();
  const downloadCovidImageMutation = useDownloadCovidImage();

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
    <>
      {(editGroupMutation.isLoading || deleteGroupMutation.isLoading) && (
        <Loading isOpen />
      )}

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <GroupForm
            initialGroup={initialGroup}
            onDeleteGroup={deleteGroupMutation.mutate}
            onSave={editGroupMutation.mutate}
            groupUser={groupUser}
          />
        </Grid>

        {(editGroupMutation.isError || deleteGroupMutation.isError) && (
          <UserError />
        )}

        <Grid item>
          <h2>Campers</h2>
        </Grid>
        <Grid item>
          <Link href={`/camperAdd?groupId=${initialGroup.id}`}>
            Add a Camper
          </Link>
        </Grid>
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
              <TableCell>Notes</TableCell>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {campers.map((camper) => (
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
                <TableCell>{camper.notes}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Button onClick={() => handleDownload({ campers })}>
            Click here to download an Excel file with all your campers
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { BASE_URL } = process.env;
  const groupId = getQueryParamId(context.query.id);

  if (groupId) {
    const groupsRes = await fetch(`${BASE_URL}/api/groups?id=${groupId}`);
    const groupsJson = await groupsRes.json();
    const group = groupsJson[0];

    const campersRes = await fetch(
      `${BASE_URL}/api/campers?groupId=${groupId}`
    );
    const campersJson = await campersRes.json();

    const usersRes = await fetch(`${BASE_URL}/api/users?groupId=${groupId}`);
    const usersJson = await usersRes.json();

    return {
      props: {
        group,
        campers: campersJson,
        groupUser: usersJson,
      },
    };
  }
};

export default GroupEdit;
