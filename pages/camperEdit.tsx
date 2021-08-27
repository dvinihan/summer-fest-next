import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import CamperForm from '../components/CamperForm';
import Loading from '../components/Loading';
import PageError from '../components/PageError';
import Camper from '../models/Camper';

interface Props {
  groupId: number;
  camper: Camper;
}

const CamperEdit = ({ camper }: Props) => {
  const router = useRouter();

  const editCamperMutation = useMutation((currentCamper) =>
    axios.post('/api/editCamper', currentCamper)
  );
  const deleteCamperMutation = useMutation((camperId) =>
    axios.post('/api/deleteCamper', camperId)
  );

  useEffect(() => {
    if (editCamperMutation.isSuccess || deleteCamperMutation.isSuccess) {
      router.push(`/groupEdit?id=${camper.group_id}`);
    }
  });

  const handleEditCamper = () => {
    editCamperMutation.mutate();
  };

  const handleDeleteCamper = () => {
    deleteCamperMutation.mutate();
  };

  if (!editCamperMutation.isIdle && !deleteCamperMutation.isIdle) {
    return <Loading isOpen />;
  }

  //   if (shouldRedirect) {
  //     return (
  //       <Redirect
  //         to={{
  //           pathname: '/admin',
  //         }}
  //       />
  //     );
  //   }

  //   if (!activeUserClearance) {
  //     return (
  //       <Redirect
  //         to={{
  //           pathname: '/',
  //         }}
  //       />
  //     );
  //   }

  // return;
  // !currentCamper ? (
  //   <PageError />
  // ) :
  return (
    <>
      <CamperForm
        initialCamper={camper}
        onDeleteCamper={handleDeleteCamper}
        onSave={handleEditCamper}
      />
      {(editCamperMutation.isError || deleteCamperMutation.isError) && (
        <div>There&apos;s been an error</div>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { BASE_URL } = process.env;
  const camperId = parseInt(context.query.id);

  const camperRes = await fetch(`${BASE_URL}/api/campers?camperId=${camperId}`);
  const camperJson = await camperRes.json();

  return {
    props: {
      camper: camperJson,
    },
  };
};

export default CamperEdit;
