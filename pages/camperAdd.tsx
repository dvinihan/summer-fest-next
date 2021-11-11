import React, { useEffect } from 'react';
import Camper from '../src/types/Camper';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';
import Loading from '../src/components/Loading';
import PageError from '../src/components/PageError';
import CamperForm from '../src/components/CamperForm';
import { getQueryParamId } from '../src/helpers/getQueryParamId';
import FormError from '../src/components/FormError';
import { Grid } from '@mui/material';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const CamperAdd = () => {
  const router = useRouter();
  const groupId = getQueryParamId(router.query.groupId);

  const { mutate, isSuccess, isLoading, isError } = useMutation(
    ({ camper }: { camper: Camper }) => axios.post('/api/addCamper', camper)
  );

  const handleSave = ({ camper }: { camper: Camper }) => mutate({ camper });

  useEffect(() => {
    if (isSuccess) {
      router.push(`/groupEdit?id=${groupId}`);
    }
  });

  const showLoading = isLoading || isSuccess;

  return !groupId ? (
    <PageError />
  ) : (
    <>
      {showLoading && <Loading />}

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <CamperForm
            initialCamper={
              new Camper({ group_id: groupId, signed_status: 'Not Sent' })
            }
            onSave={handleSave}
          />
        </Grid>
        <Grid item>{isError && <FormError />}</Grid>
      </Grid>
    </>
  );
};

export default withPageAuthRequired(CamperAdd);
