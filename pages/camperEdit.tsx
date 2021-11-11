import { Grid } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useMutation } from 'react-query';
import CamperForm from '../src/components/CamperForm';
import { getQueryParamId } from '../src/helpers/getQueryParamId';
import { fetchCamperById } from '../src/queries/campers';
import axios from 'axios';
import Camper from '../src/types/Camper';
import PageError from '../src/components/PageError';
import Loading from '../src/components/Loading';
import FormError from '../src/components/FormError';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getIsAdmin } from '../src/helpers';
import { fetchUserRoles } from '../src/queries/users';

type Props = {
  isAdmin: boolean;
  camper?: Camper;
};

const CamperEdit = ({ isAdmin, camper }: Props) => {
  if (!camper) {
    return <PageError isAdmin={isAdmin} />;
  }

  const router = useRouter();

  const editCamperMutation = useMutation(
    async ({ camper }: { camper: Camper }) =>
      await axios.post('/api/editCamper', camper)
  );
  const deleteCamperMutation = useMutation(
    async () => await axios.delete(`/api/deleteCamper?id=${camper.id}`)
  );

  useEffect(() => {
    if (editCamperMutation.isSuccess || deleteCamperMutation.isSuccess) {
      router.push(`/groupEdit?id=${camper.group_id}`);
    }
  });

  const showLoadingModal =
    editCamperMutation.isLoading ||
    deleteCamperMutation.isLoading ||
    editCamperMutation.isSuccess ||
    deleteCamperMutation.isSuccess;

  return (
    <>
      {showLoadingModal && <Loading />}

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
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
    const userRoles = await fetchUserRoles({
      sessionCookie,
    });
    const isAdmin = getIsAdmin(userRoles);

    const camperId = getQueryParamId(context.query.id);
    if (!camperId) {
      return {
        props: {},
      };
    }

    const camper = await fetchCamperById({ sessionCookie, camperId });

    return {
      props: {
        camper,
      },
    };
  },
});

export default CamperEdit;
