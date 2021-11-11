import React from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import Group from '../src/types/Group';
import User from '../src/types/User';
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
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetServerSidePropsContext } from 'next';
import { fetchAllUsers, fetchUserRoles } from '../src/queries/users';
import AdminError from '../src/components/AdminError';
import { fetchGroupsById } from '../src/queries/groups';
import { PageHeader } from '../src/components/PageHeader';
import { getIsAdmin } from '../src/helpers';

type Props = {
  isAdmin: boolean;
  groups: Group[];
  users: User[];
};

const Users = ({ isAdmin, groups, users }: Props) => {
  if (!isAdmin) {
    return <AdminError />;
  }

  const makeAdminMutation = useMutation(
    async ({ userId }: { userId: string }) =>
      await axios.post(`/api/makeAdmin`, { userId })
  );

  const deleteUserMutation = useMutation(
    async ({ userId }: { userId: string }) =>
      await axios.delete(`/api/deleteUser?id=${userId}`)
  );

  const getGroupName = (groups: Group[], user: User) => {
    const group = groups.find((g) => g.id === user.user_metadata.group_id);
    return group?.group_name;
  };

  return (
    <>
      <PageHeader isAdmin={isAdmin} />
      <TableContainer component={Paper} sx={{ marginTop: '80px' }}>
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
            {users.map((user: User) => {
              const isCurrentUserAdmin = () => {
                // TODO
              };

              return (
                <TableRow key={user.user_id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{getGroupName(groups, user)}</TableCell>
                  <TableCell>
                    {isCurrentUserAdmin ? 'Admin' : 'Leader'}
                  </TableCell>
                  <TableCell>
                    {!isCurrentUserAdmin && (
                      <Button
                        className="table-name"
                        onClick={() =>
                          makeAdminMutation.mutate({ userId: user.user_id })
                        }
                        type="button"
                      >
                        MAKE ADMIN (cannot be undone)
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {!isCurrentUserAdmin && (
                      <Button
                        className="table-name"
                        onClick={() =>
                          deleteUserMutation.mutate({ userId: user.user_id })
                        }
                        type="button"
                      >
                        DELETE USER (cannot be undone)
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    const sessionCookie = context.req.headers.cookie;

    const [groups, users, userRoles] = await Promise.all([
      fetchGroupsById({
        sessionCookie,
      }),
      fetchAllUsers({
        sessionCookie,
      }),
      fetchUserRoles({
        sessionCookie,
      }),
    ]);
    const isAdmin = getIsAdmin(userRoles);

    return {
      props: {
        isAdmin,
        groups,
        users,
      },
    };
  },
});

export default Users;
