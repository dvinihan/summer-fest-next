import { Grid } from '@mui/material';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import CamperForm from '../src/components/CamperForm';
import FormError from '../src/FormError';
import Loading from '../src/Loading';
import PageError from '../src/PageError';
import { getQueryParamId } from '../src/helpers/getQueryParamId';
import { fetchCamperById } from '../src/queries/campers';
import axios from 'axios';
import Camper from '../src/models/Camper';

const CamperEdit = () => {
  const router = useRouter();

  const camperId = getQueryParamId(router.query.id);
  const camperQuery = useQuery('camperById', () => fetchCamperById(camperId));
  // there should only be one camper with this id
  const camper = camperQuery.data[0];

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
    editCamperMutation.isLoading ||
    deleteCamperMutation.isLoading ||
    editCamperMutation.isSuccess ||
    deleteCamperMutation.isSuccess;

  return !camper ? (
    <PageError />
  ) : (
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

export const getServerSideProps = async (context: NextPageContext) => {
  const queryClient = new QueryClient();

  const camperId = getQueryParamId(context.query.id);

  if (camperId) {
    await queryClient.prefetchQuery('camperById', () =>
      fetchCamperById(camperId)
    );

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  }
};

export default CamperEdit;
