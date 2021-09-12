import { Grid } from '@material-ui/core';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import CamperForm from '../components/CamperForm';
import FormError from '../components/FormError';
import Loading from '../components/Loading';
import PageError from '../components/PageError';
import getQueryParamId from '../helpers/getQueryParamId';
import {
  fetchCamperById,
  useDeleteCamper,
  useEditCamper,
} from '../queries/campers';

const CamperEdit = () => {
  const router = useRouter();

  const camperId = getQueryParamId(router.query.id);
  const camperQuery = useQuery('camperById', () => fetchCamperById(camperId));
  // there should only be one camper with this id
  const camper = camperQuery.data[0];

  const editCamperMutation = useEditCamper();
  const deleteCamperMutation = useDeleteCamper();

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
