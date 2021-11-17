import { Camper } from '../src/types/Camper';
import { useMutation } from 'react-query';
import axios from 'axios';
import PageError from '../src/components/PageError';
import CamperForm from '../src/components/CamperForm';
import { getQueryParamId } from '../src/helpers/getQueryParamId';
import FormError from '../src/components/FormError';
import { Grid } from '@mui/material';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PageHeader } from '../src/components/PageHeader';
import { useAppContext } from '../src/context/AppContext';
import { GetServerSidePropsContext } from 'next';
import { useNavigate } from '../src/hooks/useNavigate';
import { useMakeMutationOptions } from '../src/hooks/useMakeMutationOptions';

type Props = {
  groupId?: number;
};

const CamperAdd = ({ groupId }: Props) => {
  const navigate = useNavigate();
  const { setToastMessage } = useAppContext();
  const makeMutationOptions = useMakeMutationOptions();

  const { mutate, isError } = useMutation(
    async ({ editedCamper }: { editedCamper: Camper }) =>
      await axios.post('/api/addCamper', editedCamper),
    makeMutationOptions({
      onSuccess: ({ data }) => {
        const toastMessage = data.emailError
          ? 'Camper successfully saved, but there was a problem sending a waiver through email. Please try again later.'
          : 'Camper successfully saved.';

        navigate(`camperEdit?id=${data.id}`);
        setToastMessage(toastMessage);
      },
    })
  );

  return !groupId ? (
    <PageError />
  ) : (
    <>
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
            initialCamper={
              new Camper({ group_id: groupId, signed_status: 'Not Sent' })
            }
            onSave={mutate}
          />
        </Grid>
        <Grid item>{isError && <FormError />}</Grid>
      </Grid>
    </>
  );
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    return {
      props: {
        groupId: getQueryParamId(context.query.groupId),
      },
    };
  },
});

export default CamperAdd;
