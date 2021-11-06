import React from 'react';
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query';
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
import {
  getAccessToken,
  getSession,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';
import { GetServerSidePropsContext } from 'next';
import { fetchAllUsers } from '../src/queries/users';
import { getIsAdmin } from '../src/hooks/useAdmin';
import AdminError from '../src/components/AdminError';
import { fetchGroupsById } from '../src/queries/groups';
import { PageHeader } from '../src/components/PageHeader';

type Props = {
  isAdmin: boolean;
  accessToken: string;
};

const Users = ({ isAdmin, accessToken }: Props) => {
  if (!isAdmin) {
    return <AdminError />;
  }

  const { data: groups = [], isError: groupsError } = useQuery('groups', () =>
    fetchGroupsById()
  );
  const { data: users = [], isError: usersError } = useQuery('users', () =>
    fetchAllUsers(accessToken)
  );

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

  return (
    <>
      <PageHeader />
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
            {users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{getGroupName(groups, user)}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {(groupsError || usersError) && (
        <div>There&apos;s been an error. Please refresh and try again.</div>
      )}
    </>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    const isAdmin = getIsAdmin(context);
    const { accessToken } = await getAccessToken(context.req, context.res);

    const session = getSession(context.req, context.res);
    console.log(session);

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('groups', () => fetchGroupsById());
    await queryClient.prefetchQuery('users', () => fetchAllUsers(accessToken));

    return {
      props: {
        accessToken,
        isAdmin,
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
});

export default Users;
