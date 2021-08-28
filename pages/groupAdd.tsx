import React, { useEffect } from 'react';
import { getActiveUserClearance } from '../helpers';
import GroupForm from '../components/GroupForm';
import router from 'next/router';
import Loading from '../components/Loading';
import { Container } from '@material-ui/core';
import UserError from '../components/UserError';
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

  return (
    <Container>
      {!addGroupMutation.isIdle && <Loading isOpen />}

      <GroupForm onSave={addGroupMutation.mutate} />
      {addGroupMutation.isError && <UserError />}
    </Container>
  );
};

export default GroupAdd;
