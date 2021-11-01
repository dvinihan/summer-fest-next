import React from 'react';
import { useRouter } from 'next/router';
import GroupForm from '../src/components/GroupForm';
import { Button, Container, Grid, Paper, useTheme } from '@mui/material';
import FormError from '../src/components/FormError';
import { GetServerSidePropsContext } from 'next';
import { getQueryParamId } from '../src/helpers/getQueryParamId';
import { fetchGroupsById } from '../src/queries/groups';
import handleDownload from '../src/helpers/downloadCSV';
import Loading from '../src/components/Loading';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { fetchCampersInGroup } from '../src/queries/campers';
import PageError from '../src/components/PageError';
import Group from '../src/types/Group';
import CamperTable from '../src/components/CamperTable';
import axios from 'axios';
import { useAppContext } from '../src/context/AppContext';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PageHeader } from '../src/components/PageHeader';

interface Props {
  group: Group;
}

const GroupEdit = ({ group }: Props) => {
  const router = useRouter();
  const theme = useTheme();

  const { setToastMessage } = useAppContext();

  const { data: campers = [] } = useQuery('campersInGroup', () =>
    fetchCampersInGroup(group.id)
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
          <Button onClick={() => handleDownload({ campers })}>
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

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();

    const groupId = getQueryParamId(context.query.id);

    if (groupId) {
      await queryClient.prefetchQuery('groups', () => fetchGroupsById(groupId));
      await queryClient.prefetchQuery('campersInGroup', () =>
        fetchCampersInGroup(groupId)
      );
    }

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
});

export default GroupEditContainer;
