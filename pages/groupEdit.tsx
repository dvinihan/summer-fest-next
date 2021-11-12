import React from 'react';
import { useRouter } from 'next/router';
import GroupForm from '../src/components/GroupForm';
import { Button, Container, Grid, Paper, useTheme } from '@mui/material';
import FormError from '../src/components/FormError';
import { GetServerSidePropsContext } from 'next';
import { getQueryParamId } from '../src/helpers/getQueryParamId';
import { fetchGroupById } from '../src/queries/groups';
import { downloadCSV } from '../src/helpers/downloadCSV';
import Loading from '../src/components/Loading';
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query';
import { fetchCampersInGroup } from '../src/queries/campers';
import PageError from '../src/components/PageError';
import Group from '../src/types/Group';
import CamperTable from '../src/components/CamperTable';
import axios from 'axios';
import { useAppContext } from '../src/context/AppContext';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PageHeader } from '../src/components/PageHeader';

type Props = {
  groupId?: number;
};

const GroupEdit = ({ groupId }: Props) => {
  const router = useRouter();
  const theme = useTheme();

  const { setToastMessage } = useAppContext();

  const { data: campers = [] } = useQuery(`campers - group ${groupId}`, () =>
    fetchCampersInGroup(groupId)
  );
  const { data: group } = useQuery(`group ${groupId}`, () =>
    fetchGroupById(groupId)
  );

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

  if (!groupId || !group) {
    return <PageError />;
  }

  return (
    <Container>
      {showLoadingModal && <Loading />}

      <PageHeader />
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

        <CamperTable campers={campers} />

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
    const groupId = getQueryParamId(context.query.id);

    const queryClient = new QueryClient();
    if (groupId) {
      await queryClient.prefetchQuery(`campers - group ${groupId}`, () =>
        fetchCampersInGroup(groupId, sessionCookie)
      );
      await queryClient.prefetchQuery(`group ${groupId}`, () =>
        fetchGroupById(groupId, sessionCookie)
      );
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        groupId,
      },
    };
  },
});

export default GroupEdit;
