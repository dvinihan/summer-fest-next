import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getActiveUserClearance } from '../helpers';
import GroupForm from '../components/GroupForm';
import { Button, Container, Grid, Paper } from '@material-ui/core';
import FormError from '../components/FormError';
import { NextPageContext } from 'next';
import getQueryParamId from '../helpers/getQueryParamId';
import {
  useEditGroup,
  useDeleteGroup,
  fetchGroupsById,
} from '../queries/groups';
import handleDownload from '../helpers/downloadCSV';
import Loading from '../components/Loading';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { fetchCampersInGroup } from '../queries/campers';
import { fetchGroupUsers } from '../queries/users';
import PageError from '../components/PageError';
import Group from '../models/Group';
import { makeStyles } from '@material-ui/core/styles';
import CamperTable from '../components/CamperTable';

interface Props {
  group: Group;
}

const useStyles = makeStyles((theme: any) => ({
  button: {
    padding: theme.spacing(1),
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

  useEffect(() => {
    if (editGroupMutation.isSuccess || deleteGroupMutation.isSuccess) {
      router.push(`/admin`);
    }
  });

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

  const showLoadingModal =
    editGroupMutation.isLoading ||
    deleteGroupMutation.isLoading ||
    editGroupMutation.isSuccess ||
    deleteGroupMutation.isSuccess;

  return (
    <Container>
      {showLoadingModal && <Loading />}

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
