import React from 'react';
import { useRouter } from 'next/router';
import GroupForm from '../src/components/GroupForm';
import { Button, Container, Grid, Paper, useTheme } from '@mui/material';
import FormError from '../src/components/FormError';
import { GetServerSidePropsContext } from 'next';
import { getQueryParamId } from '../src/helpers/getQueryParamId';
import { fetchGroupsById } from '../src/queries/groups';
import { downloadCSV } from '../src/helpers/downloadCSV';
import Loading from '../src/components/Loading';
import { useMutation } from 'react-query';
import { fetchCampersInGroup } from '../src/queries/campers';
import PageError from '../src/components/PageError';
import Group from '../src/types/Group';
import CamperTable from '../src/components/CamperTable';
import axios from 'axios';
import { useAppContext } from '../src/context/AppContext';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PageHeader } from '../src/components/PageHeader';
import { fetchUserRoles } from '../src/queries/users';
import { getIsAdmin } from '../src/helpers';
import Camper from '../src/types/Camper';

type Props = {
  isAdmin: boolean;
  campers: Camper[];
  groups: Group[];
};

const GroupEdit = ({ isAdmin, campers, groups }: Props) => {
  const router = useRouter();
  const theme = useTheme();
  const groupId = getQueryParamId(router.query.id);

  const { setToastMessage } = useAppContext();

  const editGroupMutation = useMutation(
    (editedGroup: Group) => axios.post(`/api/editGroup`, editedGroup),
    {
      onSuccess: () => {
        setToastMessage('Group successfully saved.');
      },
    }
  );
  const deleteGroupMutation = useMutation(
    () => axios.delete(`/api/deleteGroup?id=${group.id}`),
    {
      onSuccess: () => {
        router.push('/admin');
        setToastMessage(`Group ${group.group_name} successfully deleted.`);
      },
    }
  );

  const showLoadingModal =
    editGroupMutation.isLoading || deleteGroupMutation.isLoading;

  // there should only be one group with this id
  const group = groups[0];

  if (!groupId || !group) {
    return <PageError isAdmin={isAdmin} />;
  }

  return (
    <Container>
      {showLoadingModal && <Loading />}

      <PageHeader isAdmin={isAdmin} />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <div style={{ height: '80px' }}></div>
        </Grid>
        <Grid item>
          <GroupForm
            isAdmin={isAdmin}
            initialGroup={group}
            onDeleteGroup={deleteGroupMutation.mutate}
            onSave={editGroupMutation.mutate}
          />
        </Grid>

        {(editGroupMutation.isError || deleteGroupMutation.isError) && (
          <Grid item>
            <FormError />
          </Grid>
        )}

        <Grid item>
          <h1>Campers</h1>
        </Grid>

        <CamperTable isAdmin={isAdmin} campers={campers} />

        <Grid item>
          <Button onClick={() => router.push(`/camperAdd?groupId=${group.id}`)}>
            <Paper sx={{ padding: theme.spacing(1) }}>
              <Container>Add a Camper</Container>
            </Paper>
          </Button>
        </Grid>

        <Grid item>
          <Button onClick={() => downloadCSV({ campers })}>
            <Paper sx={{ padding: theme.spacing(1) }}>
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

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    const sessionCookie = context.req.headers.cookie;
    const userRoles = await fetchUserRoles({
      sessionCookie,
    });
    const isAdmin = getIsAdmin(userRoles);

    const groupId = getQueryParamId(context.query.id);

    if (!groupId) {
      return {
        props: {
          isAdmin,
        },
      };
    }

    const [campers, groups] = await Promise.all([
      fetchCampersInGroup({ sessionCookie, groupId }),
      fetchGroupsById({ sessionCookie, groupId }),
    ]);

    return {
      props: {
        isAdmin,
        campers,
        groups,
      },
    };
  },
});

export default GroupEdit;
