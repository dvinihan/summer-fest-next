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
      {/* query will be idle until the first mutation call has been made */}
      {!addGroupMutation.isIdle && <Loading isOpen />}

      <GroupForm onSave={addGroupMutation.mutate} />
      {addGroupMutation.isError && <UserError />}
    </Container>
  );
};

export const getServerSideProps = async () => {
  const { NEXT_PUBLIC_BASE_URL } = process.env;

  const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/groups`);
  const json = await res.json();

  return {
    props: { groups: json },
  };
};

export default GroupAdd;
