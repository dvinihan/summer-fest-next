import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getActiveUserClearance } from '../helpers';
import Group from '../models/Group';
import Camper from '../models/Camper';
import User from '../models/User';
import GroupForm from '../components/GroupForm';
import { useMutation } from 'react-query';
import axios from 'axios';
import getCsvFile from '../helpers/getCsvFile';
import {
  Button,
  Grid,
  Link,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import UserError from '../components/UserError';

interface Props {
  group: Group;
  campersInGroup: Camper[];
  groupUser?: User;
}

const GroupEdit = ({
  group: initialGroup,
  campersInGroup = [],
  groupUser,
}: Props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const activeUserClearance = getActiveUserClearance();

  const router = useRouter();

  const editGroupMutation = useMutation((editedGroup: Group) =>
    axios.post(`/api/editGroup`, editedGroup)
  );
  const deleteGroupMutation = useMutation((groupId: number) =>
    axios.delete(`/api/deleteGroup?id=${groupId}`)
  );
  const downloadCovidImageMutation = useMutation((covidImageFileName) =>
    axios.post(`/api/downloadCovidImage`, covidImageFileName)
  );

  const handleEditGroup = (group) => {
    editGroupMutation.mutate({
      id: group.id,
      group_name: group.group_name,
      leader_name: group.leader_name,
    });
  };

  const handleDeleteGroup = (groupId) => {
    deleteGroupMutation.mutate(groupId);
  };

  const handleDownloadClick = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8${encodeURIComponent(
        getCsvFile({ campers: campersInGroup })
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

  const downloadImage = (covidFileName) => {
    downloadCovidImageMutation.mutate(covidFileName);

    const res = downloadCovidImageMutation.data;
    const link = document.createElement('a');
    // @ts-ignore
    link.href = `data:image/jpeg;base64,${res.encodedImage}`;
    link.download = covidFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <GroupForm initialGroup={initialGroup} onSave={handleEditGroup} />
        </Grid>

        {(editGroupMutation.isError || deleteGroupMutation.isError) && (
          <UserError />
        )}

        <Grid item>
          <h2>Campers</h2>
        </Grid>
        <Grid item>
          <Link href="/camperAdd">Add a Camper</Link>
        </Grid>
        {activeUserClearance === 'admin' && (
          <Grid item>
            <Button onClick={() => setShowDeleteModal(true)}>Delete</Button>
          </Grid>
        )}
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
            {campersInGroup.map((camper) => (
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
                        downloadImage(camper.covid_image_file_name)
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
          <Button onClick={handleDownloadClick}>
            Click here to download an Excel file with all your campers
          </Button>
        </Grid>
      </Grid>

      {showDeleteModal && (
        <Modal open>
          <>
            <h1>
              Are you sure you want to PERMANENTLY delete{' '}
              {initialGroup.group_name} and all its campers
              {groupUser && (
                <span>, along with the user {groupUser.username}</span>
              )}
              ?
            </h1>
            <Button onClick={() => setShowDeleteModal(false)}>No</Button>
            <Button onClick={handleDeleteGroup}>Yes</Button>
          </>
        </Modal>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { BASE_URL } = process.env;
  const groupId = parseInt(context.query.id);

  const groupRes = await fetch(`${BASE_URL}/api/groups?id=${groupId}`);
  const groupJson = await groupRes.json();
  const group = groupJson[0];

  const campersRes = await fetch(`${BASE_URL}/api/campers?groupId=${groupId}`);
  const campersJson = await campersRes.json();

  const usersRes = await fetch(`${BASE_URL}/api/users?groupId=${groupId}`);
  const usersJson = await usersRes.json();

  return {
    props: {
      group,
      campersInGroup: campersJson,
      groupUser: usersJson,
    },
  };
};

export default GroupEdit;
