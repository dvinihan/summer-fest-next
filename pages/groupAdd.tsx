import React, { useEffect } from 'react';
import GroupForm from '../src/components/GroupForm';
import router from 'next/router';
import Loading from '../src/components/Loading';
import { Container, Grid } from '@mui/material';
import FormError from '../src/components/FormError';
import axios from 'axios';
import { useMutation } from 'react-query';
import Group from '../src/types/Group';
import { getIsAdmin } from '../src/hooks/useAdmin';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PageHeader } from '../src/components/PageHeader';
import { GetServerSidePropsContext } from 'next';
import AdminError from '../src/components/AdminError';

type Props = {
  isAdmin: boolean;
};

const GroupAdd = ({ isAdmin }: Props) => {
  if (!isAdmin) {
    return <AdminError />;
  }

  const { mutate, data, isSuccess, isLoading, isError } = useMutation(
    async (newGroup: Group) => await axios.post('/api/addGroup', newGroup)
  );

  useEffect(() => {
    if (isSuccess) {
      router.push(`groupEdit?id=${data.data}`);
    }
  });

  const showLoadingModal = isLoading || isSuccess;

  return (
    <Container>
      {showLoadingModal && <Loading />}

      <PageHeader />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <div style={{ height: '80px' }}></div>
        </Grid>
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

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    const isAdmin = getIsAdmin(context);
    return {
      props: {
        isAdmin,
      },
    };
  },
});

export default GroupAdd;
