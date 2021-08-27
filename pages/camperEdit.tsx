import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useMutation } from 'react-query';
import CamperForm from '../components/CamperForm';
import Loading from '../components/Loading';
import PageError from '../components/PageError';
import Camper from '../models/Camper';

interface Props {
  groupId: string;
  camper?: Camper;
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

  return !camper ? (
    <PageError />
  ) : (
    <>
      <CamperForm
        initialCamper={camper}
        onDeleteCamper={() => deleteCamperMutation.mutate()}
        onSave={() => editCamperMutation.mutate()}
      />
      {(editCamperMutation.isError || deleteCamperMutation.isError) && (
        <div>There&apos;s been an error</div>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const camperId = context.query.id;

  const camperRes = await fetch(
    `${NEXT_PUBLIC_BASE_URL}/api/campers?camperId=${camperId}`
  );
  const camperJson = await camperRes.json();

  return {
    props: {
      camper: camperJson,
    },
  };
};

export default CamperEdit;
