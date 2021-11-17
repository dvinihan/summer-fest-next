import {
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { downloadCSV } from '../src/helpers/downloadCSV';
import { Group } from '../src/types/Group';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetServerSidePropsContext } from 'next';
import { PageHeader } from '../src/components/PageHeader';
import { fetchAllGroups } from '../src/queries/groups';
import { getIsAdminFromContext } from '../src/helpers';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { withAdmin } from '../src/components/withAdmin';
import { useNavigate } from '../src/hooks/useNavigate';
import { useAppContext } from '../src/context/AppContext';

const Admin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setIsLoading } = useAppContext();

  const { data: groups = [] } = useQuery<Group[]>('allGroups', () =>
    fetchAllGroups()
  );

  const handleDownloadCsv = async () => {
    setIsLoading(true);
    await downloadCSV({ groups, isAdmin: true });
    setIsLoading(false);
  };

  return (
    <Container maxWidth="xl">
      <PageHeader />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <div style={{ height: '60px' }}></div>
        </Grid>
        <Grid item>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Group Name</TableCell>
                  <TableCell>Leader</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {groups.map((group: Group) =>
                  group.id === 1 ? null : (
                    <TableRow key={group.id}>
                      <TableCell>
                        <Button
                          onClick={() => navigate(`/groupEdit?id=${group.id}`)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>{group.group_name}</TableCell>
                      <TableCell>{group.leader_name}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Button onClick={() => navigate('/groupAdd')}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                  <Container>Add a Group</Container>
                </Paper>
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => navigate('/userAdd')}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                  <Container>Add a User</Container>
                </Paper>
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => navigate('/users')}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                  <Container>View All Users</Container>
                </Paper>
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Button onClick={handleDownloadCsv} type="button">
            <Paper sx={{ padding: theme.spacing(1) }}>
              <Container>Download All Data</Container>
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
    const isAdmin = getIsAdminFromContext(context);

    const queryClient = new QueryClient();
    if (isAdmin) {
      await queryClient.prefetchQuery('allGroups', () =>
        fetchAllGroups(sessionCookie)
      );
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        isAdmin,
      },
    };
  },
});

export default withAdmin(Admin);
