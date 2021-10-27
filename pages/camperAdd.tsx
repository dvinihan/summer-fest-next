import React, { useEffect } from 'react';
import Camper from '../models/Camper';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';
import Loading from '../src/Loading';
import PageError from '../src/PageError';
import CamperForm from '../src/CamperForm';
import { getQueryParamId } from '../helpers/getQueryParamId';
import FormError from '../src/FormError';
import { Grid } from '@mui/material';

const CamperAdd = () => {
  const router = useRouter();
  const groupId = getQueryParamId(router.query.groupId);

  const { mutate, isSuccess, isLoading, isError } = useMutation(
    (camper: Camper) => axios.post('/api/addCamper', camper)
  );

  const handleSave = (camper: Camper) => mutate(camper);

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

export default CamperAdd;
