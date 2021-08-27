import React, { useEffect } from 'react';
import { getActiveUserClearance } from '../helpers';
import Group from '../models/Group';
import GroupForm from '../components/GroupForm';
import { useMutation } from 'react-query';
import axios from 'axios';
import router from 'next/router';
import Loading from '../components/Loading';
import { Container } from '@material-ui/core';
import UserError from '../components/UserError';

interface Props {
  groups: Group[];
}

const GroupAdd = ({ groups }: Props) => {
  const maxGroupId = groups.reduce((max, group) => Math.max(max, group.id), 0);
  const newGroupId = maxGroupId + 1;

  const mutation = useMutation((newGroup: Group) =>
    axios.post('/api/addGroup', newGroup)
  );

  useEffect(() => {
    if (mutation.isSuccess) {
      router.push(`/groupEdit?id=${newGroupId}`);
    }
  });

  const handleAddGroup = (group: Group) => {
    mutation.mutate({
      id: newGroupId,
      group_name: group.group_name,
      leader_name: group.leader_name,
    });
  };

  // const activeUserClearance = getActiveUserClearance();
  // if (typeof window !== 'undefined' && activeUserClearance !== 'admin') {
  //   router.replace('/');
  //   return null;
  // }

  if (!mutation.isIdle) {
    return <Loading isOpen />;
  }

  return (
    <Container>
      <GroupForm onSave={handleAddGroup} />
      {mutation.isError && <UserError />}
    </Container>
  );
};

export const getServerSideProps = async () => {
  const { BASE_URL } = process.env;

  const res = await fetch(`${BASE_URL}/api/groups`);
  const json = await res.json();

  return {
    props: { groups: json },
  };
};

export default GroupAdd;
