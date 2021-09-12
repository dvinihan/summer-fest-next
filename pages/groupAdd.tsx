import React, { useEffect } from 'react';
import { getActiveUserClearance } from '../helpers';
import GroupForm from '../components/GroupForm';
import router from 'next/router';
import Loading from '../components/Loading';
import { Container, Grid } from '@material-ui/core';
import FormError from '../components/FormError';
import { useAddGroup } from '../queries/groups';

const GroupAdd = () => {
  const addGroupMutation = useAddGroup();

  useEffect(() => {
    if (addGroupMutation.isSuccess) {
      const axiosResponse = addGroupMutation.data;
      router.push(`groupEdit?id=${axiosResponse.data}`);
    }
  });

  // const activeUserClearance = getActiveUserClearance();
  // if (typeof window !== 'undefined' && activeUserClearance !== 'admin') {
  //   router.replace('/');
  //   return null;
  // }

  const showLoadingModal =
    addGroupMutation.isLoading || addGroupMutation.isSuccess;

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
          <GroupForm onSave={addGroupMutation.mutate} />
        </Grid>

        {addGroupMutation.isError && (
          <Grid item>
            <FormError />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default GroupAdd;
