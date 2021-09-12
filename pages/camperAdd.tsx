import React, { useEffect } from 'react';
import Camper from '../models/Camper';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';
import Loading from '../components/Loading';
import PageError from '../components/PageError';
import CamperForm from '../components/CamperForm';
import getQueryParamId from '../helpers/getQueryParamId';
import FormError from '../components/FormError';
import { Grid } from '@material-ui/core';

const CamperAdd = () => {
  const router = useRouter();
  const groupId = getQueryParamId(router.query.groupId);

  const mutation = useMutation((camper: Camper) => {
    return axios.post('/api/addCamper', camper);
  });

  const handleSave = (camper: Camper) => mutation.mutate(camper);

  useEffect(() => {
    if (mutation.isSuccess) {
      router.push(`/groupEdit?id=${groupId}`);
    }
  });

  const showLoading = mutation.isLoading || mutation.isSuccess;

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
        <Grid item>{mutation.isError && <FormError />}</Grid>
      </Grid>
    </>
  );
};

export default CamperAdd;
