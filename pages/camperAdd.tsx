import React, { useEffect } from 'react';
import Camper from '../models/Camper';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';
import Loading from '../components/Loading';
import PageError from '../components/PageError';
import CamperForm from '../components/CamperForm';

const CamperAdd = () => {
  const router = useRouter();
  const groupId = router.query.groupId;

  const mutation = useMutation((camper: Camper) => {
    console.log(camper);
    return axios.post('/api/addCamper', camper);
  });

  const handleSave = (camper: Camper) => mutation.mutate(camper);

  useEffect(() => {
    if (mutation.isSuccess) {
      router.push(`/groupEdit?id=${groupId}`);
    }
  });

  if (!mutation.isIdle) {
    return <Loading isOpen />;
  }

  return !groupId ? (
    <PageError />
  ) : (
    <>
      <CamperForm
        initialCamper={
          new Camper({ group_id: groupId, signed_status: 'Not Sent' })
        }
        onSave={handleSave}
      />
      {mutation.isError && <div>There&apos;s been an error</div>}
    </>
  );
};

export default CamperAdd;
