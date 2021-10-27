import React, { useEffect } from 'react';
import { getActiveUserClearance } from '../helpers';
import GroupForm from '../src/GroupForm';
import router from 'next/router';
import Loading from '../src/Loading';
import { Container, Grid } from '@mui/material';
import FormError from '../src/FormError';
import axios from 'axios';
import { useMutation } from 'react-query';
import Group from '../models/Group';

const GroupAdd = () => {
  const { mutate, data, isSuccess, isLoading, isError } = useMutation(
    async (newGroup: Group) => await axios.post('/api/addGroup', newGroup)
  );

  useEffect(() => {
    if (isSuccess) {
      const axiosResponse = data;
      router.push(`groupEdit?id=${axiosResponse.data}`);
    }
  });

  // const activeUserClearance = getActiveUserClearance();
  // if (typeof window !== 'undefined' && activeUserClearance !== 'admin') {
  //   router.replace('/');
  //   return null;
  // }

  const showLoadingModal = isLoading || isSuccess;

  return (
    <Container>
      {showLoadingModal && <Loading />}

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
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

export default GroupAdd;
