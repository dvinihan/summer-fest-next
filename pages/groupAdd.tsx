import GroupForm from '../src/components/GroupForm';
import { Container, Grid } from '@mui/material';
import FormError from '../src/components/FormError';
import axios from 'axios';
import { useMutation } from 'react-query';
import { Group } from '../src/types/Group';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PageHeader } from '../src/components/PageHeader';
import { GetServerSidePropsContext } from 'next';
import { getIsAdminFromContext } from '../src/helpers';
import { withAdmin } from '../src/components/withAdmin';
import { useNavigate } from '../src/hooks/useNavigate';
import { useMakeMutationOptions } from '../src/hooks/useMakeMutationOptions';

const GroupAdd = () => {
  const navigate = useNavigate();
  const makeMutationOptions = useMakeMutationOptions();

  const { mutate, isError } = useMutation(
    async (newGroup: Group) => await axios.post('/api/addGroup', newGroup),
    makeMutationOptions({
      successToastMessage: 'Group successfully saved.',
      onSuccess: ({ data }) => {
        navigate(`groupEdit?id=${data.id}`);
      },
    })
  );

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
          <GroupForm onSave={mutate} />
        </Grid>

        {isError && (
          <Grid item>
            <FormError />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    return {
      props: {
        isAdmin: getIsAdminFromContext(context),
      },
    };
  },
});

export default withAdmin(GroupAdd);
