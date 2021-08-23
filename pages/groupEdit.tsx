import React, { useState } from 'react';
// import Error from './Error';
import { useRouter } from 'next/router';
import { getActiveUserClearance } from '../helpers';
import Group from '../models/Group';
import Camper from '../models/Camper';
import User from '../models/User';
import Link from 'next/link';
import GroupForm from '../components/GroupForm';
import styled from 'styled-components';
import { useMutation } from 'react-query';
import axios from 'axios';
import getCsvFile from '../helpers/getCsvFile';

const GroupEditContainer = styled.div`
  text-align: center;
`;
const GroupEditLink = styled(Link)`
  color: rgb(55, 87, 156);
  font-weight: 600;
  margin: 0 20px;
`;

const CampersTableTitle = styled.div`
  margin: 10px 0;
  font-size: 26px;
  text-decoration: underline;
`;

const TableHeaderRow = styled.tr`
  background-color: rgb(179, 173, 173);
`;

const TableCell = styled.td`
  padding: 8px;
  font-size: 14px;
`;

const TableHeader = styled.th`
  padding: 8px;
  font-size: 14px;
`;

const TableRow = styled.tr`
  &${TableCell} {
    background-color: rgb(212, 193, 193);
  }
`;

const Table = styled.table`
  margin-top: 20px;
`;

const DownloadButton = styled.button`
  margin: 20px 0;
`;

const NoYesButton = styled.button`
  margin: 10px;
  background-color: yellow;
  color: black;
`;

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
    <GroupEditContainer>
      <GroupForm initialGroup={initialGroup} onSave={handleEditGroup} />

      {showDeleteModal && (
        <div>
          <h1>
            Are you sure you want to PERMANENTLY delete{' '}
            {initialGroup.group_name} and all its campers
            {groupUser && (
              <span>, along with the user {groupUser.username}</span>
            )}
            ?
          </h1>
          <NoYesButton onClick={() => setShowDeleteModal(false)}>
            No
          </NoYesButton>
          <NoYesButton onClick={handleDeleteGroup}>Yes</NoYesButton>
        </div>
      )}

      {(editGroupMutation.isError || deleteGroupMutation.isError) && (
        <div id="error">There&apos;s been an error. Please try again.</div>
      )}

      <CampersTableTitle>Campers</CampersTableTitle>

      <GroupEditLink href="/camperAdd">Add a Camper</GroupEditLink>

      {activeUserClearance === 'admin' && (
        <button onClick={() => setShowDeleteModal(true)}>Delete</button>
      )}
      <Table>
        <tbody>
          <TableHeaderRow>
            <TableHeader aria-label="control" />
            <TableHeader>First Name</TableHeader>
            <TableHeader>Last Name</TableHeader>
            <TableHeader>Gender</TableHeader>
            <TableHeader>Birthday</TableHeader>
            <TableHeader>Grade just completed</TableHeader>
            <TableHeader>Food Alergies</TableHeader>
            <TableHeader>Parent or Guardian Email</TableHeader>
            <TableHeader>Emergency Contact Name</TableHeader>
            <TableHeader>Emergency Contact Number</TableHeader>
            <TableHeader>Roommate</TableHeader>
            <TableHeader>Notes</TableHeader>
            <TableHeader>Online or Paper Registration</TableHeader>
            <TableHeader>Waiver Signed Status</TableHeader>
            <TableHeader>Waiver Signed By</TableHeader>
            {activeUserClearance === 'admin' && (
              <TableHeader>Room Assignment</TableHeader>
            )}
            <TableHeader>Is Adult Leader</TableHeader>
            <TableHeader>Student Leadership Track</TableHeader>
            <TableHeader>Camp Attending</TableHeader>
            <TableHeader>COVID Image Type</TableHeader>
            <TableHeader>COVID Image</TableHeader>
          </TableHeaderRow>

          {campersInGroup.map((camper) => (
            <TableRow key={camper.id}>
              <TableCell>
                <GroupEditLink href={`/camperEdit?id=${camper.id}`}>
                  Edit
                </GroupEditLink>
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
              {activeUserClearance === 'admin' && <td>{camper.room}</td>}
              <TableCell>{camper.adult_leader}</TableCell>
              <TableCell>{camper.student_leadership_track}</TableCell>
              <TableCell>{camper.camp_attending}</TableCell>
              <TableCell>{camper.covid_image_type}</TableCell>
              <TableCell>
                {camper.covid_image_file_name && (
                  <button
                    type="button"
                    style={{ cursor: 'pointer' }}
                    onClick={() => downloadImage(camper.covid_image_file_name)}
                  >
                    Download
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <DownloadButton onClick={handleDownloadClick}>
        Click here to download an Excel file with all your campers
      </DownloadButton>
    </GroupEditContainer>
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
