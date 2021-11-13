import { Grid } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query';
import CamperForm from '../src/components/CamperForm';
import { getQueryParamId } from '../src/helpers/getQueryParamId';
import { fetchCamperById } from '../src/queries/campers';
import axios from 'axios';
import { Camper } from '../src/types/Camper';
import PageError from '../src/components/PageError';
import Loading from '../src/components/Loading';
import FormError from '../src/components/FormError';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PageHeader } from '../src/components/PageHeader';
import { useAppContext } from '../src/context/AppContext';

type Props = {
  camperId?: number;
};

const CamperEdit = ({ camperId }: Props) => {
  const router = useRouter();
  const { setToastMessage } = useAppContext();

  const { data: camper } = useQuery<Camper>(`camper ${camperId}`, () =>
    fetchCamperById(camperId)
  );

  const editCamperMutation = useMutation(
    async ({ editedCamper }: { editedCamper: Camper }) =>
      await axios.post('/api/editCamper', editedCamper),
    {
      onSuccess: ({ data }) => {
        const toastMessage = data.emailError
          ? 'Camper successfully saved, but there was a problem sending a waiver through email. Please try again later.'
          : 'Camper successfully saved.';

        setToastMessage(toastMessage);
      },
    }
  );
  const deleteCamperMutation = useMutation(
    async () => await axios.delete(`/api/deleteCamper?id=${camper.id}`),
    {
      onSuccess: () => {
        router.push('/admin');
        setToastMessage(
          `Camper ${camper.first_name} ${camper.last_name} successfully deleted.`
        );
      },
    }
  );

  const showLoadingModal =
    editCamperMutation.isLoading || deleteCamperMutation.isLoading;

  if (!camper || !camperId) {
    return <PageError />;
  }

  return (
    <>
      {showLoadingModal && <Loading />}

      <PageHeader />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ marginTop: '80px' }}
      >
        <Grid item>
          <CamperForm
            initialCamper={camper}
            onDeleteCamper={deleteCamperMutation.mutate}
            onSave={editCamperMutation.mutate}
          />
        </Grid>
        {(editCamperMutation.isError || deleteCamperMutation.isError) && (
          <Grid item>
            <FormError />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    const sessionCookie = context.req.headers.cookie;
    const camperId = getQueryParamId(context.query.id);

    const queryClient = new QueryClient();
    if (camperId) {
      await queryClient.prefetchQuery(`camper ${camperId}`, () =>
        fetchCamperById(camperId, sessionCookie)
      );
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        camperId,
      },
    };
  },
});

export default CamperEdit;
