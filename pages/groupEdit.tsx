import GroupForm from '../src/components/GroupForm';
import { Button, Container, Grid, Paper, useTheme } from '@mui/material';
import FormError from '../src/components/FormError';
import { GetServerSidePropsContext } from 'next';
import { getQueryParamId } from '../src/helpers/getQueryParamId';
import { fetchGroupById } from '../src/queries/groups';
import { downloadCSV } from '../src/helpers/downloadCSV';
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query';
import { fetchCampersInGroup } from '../src/queries/campers';
import PageError from '../src/components/PageError';
import { Group } from '../src/types/Group';
import CamperTable from '../src/components/CamperTable';
import axios from 'axios';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PageHeader } from '../src/components/PageHeader';
import { Camper } from '../src/types/Camper';
import { useNavigate } from '../src/hooks/useNavigate';
import { useMakeMutationOptions } from '../src/hooks/useMakeMutationOptions';
import { useAppContext } from '../src/context/AppContext';

type Props = {
  groupId?: number;
};

const GroupEdit = ({ groupId }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const makeMutationOptions = useMakeMutationOptions();
  const { setToastMessage } = useAppContext();

  const { data: campers = [] } = useQuery<Camper[]>(
    `campers - group ${groupId}`,
    () => fetchCampersInGroup(groupId)
  );
  const { data: group, refetch: refetchGroup } = useQuery<Group>(
    `group ${groupId}`,
    () => fetchGroupById(groupId)
  );

  const editGroupMutation = useMutation(
    async (editedGroup: Group) =>
      await axios.post(`/api/editGroup`, editedGroup),
    makeMutationOptions({
      onSuccess: () => {
        setToastMessage('Group successfully saved');
        refetchGroup();
      },
    })
  );
  const deleteGroupMutation = useMutation(
    async () => await axios.delete(`/api/deleteGroup?id=${group.id}`),

    makeMutationOptions({
      successToastMessage: `Group ${group.group_name} successfully deleted.`,
      successNavPath: '/admin',
    })
  );

  if (!groupId || !group) {
    return <PageError />;
  }

  return (
    <Container>
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
            onDeleteGroup={() => deleteGroupMutation.mutate({})}
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
          <Button onClick={() => navigate(`/camperAdd?groupId=${group.id}`)}>
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
