import React from 'react';
import { useRouter } from 'next/router';
import { getActiveUserClearance, getActiveUserName } from '../helpers';
import { useMutation, useQuery } from 'react-query';
import { fetchAllData } from '../queries/allData';
import axios from 'axios';
import Group from '../models/Group';
import User from '../models/User';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const Users = () => {
  const router = useRouter();

  const { data, isError } = useQuery('allData', fetchAllData);

  const makeAdminMutation = useMutation(
    async ({ userId }: { userId: number }) =>
      await axios.post(`/api/makeAdmin`, { userId })
  );

  const deleteUserMutation = useMutation(
    async ({ userId }: { userId: number }) =>
      await axios.delete(`/api/deleteUser?id=${userId}`)
  );

  const getGroupName = (groups: Group[], user: User) => {
    const group = groups.find((g) => g.id === user.group_id);
    return group && group.group_name;
  };

  if (!data?.users || !data?.groups) {
    return null;
  }

  const activeUserClearance = getActiveUserClearance();
  const activeUserName = getActiveUserName();

  // if (activeUserClearance !== 'admin') {
  //   router.push('/');
  // }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Group Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.users.map(
              (user: User) =>
                user.username !== activeUserName && (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{getGroupName(data.groups, user)}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      {user.status?.toLowerCase() === 'leader' && (
                        <Button
                          className="table-name"
                          onClick={() =>
                            makeAdminMutation.mutate({ userId: user.id })
                          }
                          type="button"
                        >
                          MAKE ADMIN (cannot be undone)
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.status?.toLowerCase() === 'leader' && (
                        <Button
                          className="table-name"
                          onClick={() =>
                            deleteUserMutation.mutate({ userId: user.id })
                          }
                          type="button"
                        >
                          DELETE USER (cannot be undone)
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {isError && (
        <div>There&apos;s been an error. Please refresh and try again.</div>
      )}
    </>
  );
};

export default Users;
