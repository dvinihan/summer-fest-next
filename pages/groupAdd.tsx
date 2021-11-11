import React, { useEffect } from 'react';
import GroupForm from '../src/components/GroupForm';
import router from 'next/router';
import Loading from '../src/components/Loading';
import { Container, Grid } from '@mui/material';
import FormError from '../src/components/FormError';
import axios from 'axios';
import { useMutation } from 'react-query';
import Group from '../src/types/Group';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { PageHeader } from '../src/components/PageHeader';
import { GetServerSidePropsContext } from 'next';
import AdminError from '../src/components/AdminError';
import { fetchUserRoles } from '../src/queries/users';
import { getIsAdmin } from '../src/helpers';

type Props = {
  isAdmin: boolean;
};

const GroupAdd = ({ isAdmin }: Props) => {
  if (!isAdmin) {
    return <AdminError />;
  }

  const {
    mutate,
    data: addGroupAxiosResponse,
    isSuccess,
    isLoading,
    isError,
  } = useMutation(
    async (newGroup: Group) => await axios.post('/api/addGroup', newGroup)
  );

  useEffect(() => {
    if (addGroupAxiosResponse?.data?.id) {
      router.push(`groupEdit?id=${addGroupAxiosResponse.data.id}`);
    }
  }, [addGroupAxiosResponse.data.id]);

  const showLoadingModal = isLoading || isSuccess;

  return (
    <Container>
      {showLoadingModal && <Loading />}

      <PageHeader isAdmin={isAdmin} />
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
          <GroupForm isAdmin={isAdmin} onSave={mutate} />
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
    const sessionCookie = context.req.headers.cookie;
    const userRoles = await fetchUserRoles({
      sessionCookie,
    });
    const isAdmin = getIsAdmin(userRoles);

    return {
      props: {
        isAdmin,
      },
    };
  },
});

export default GroupAdd;
