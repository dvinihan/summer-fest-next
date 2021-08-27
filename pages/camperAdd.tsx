import React, { useEffect, useState } from 'react';
// import { addCamper } from '../services/camper-service';
import ImageViewer from 'react-simple-image-viewer';
import { getActiveUserClearance } from '../helpers';
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

  const [showFileTypeError, setShowFileTypeError] = useState(false);
  const [camper, setCamper] = useState(
    new Camper({ signed_status: 'Not Sent' })
  );
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const mutation = useMutation(() =>
    axios.post('/api/addCamper', { groupId, camper })
  );

  useEffect(() => {
    if (mutation.isSuccess) {
      router.push(`/groupEdit?id=${groupId}`);
    }
  });

  const handleImageUpload = (e) => {
    if (e.target.files[0].type !== 'image/jpeg') {
      setShowFileTypeError(true);
      return;
    }

    setShowFileTypeError(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      setCamper(
        (currentCamper) =>
          new Camper({ ...currentCamper, covid_image: reader.result })
      );
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const activeUserClearance = getActiveUserClearance();

  const handleAddCamper = async () => {
    mutation.mutate();
  };

  if (!mutation.isIdle) {
    return <Loading isOpen />;
  }

  return !groupId ? (
    <PageError />
  ) : (
    <>
      <CamperForm />
      {mutation.isError && <div>There&apos;s been an error</div>}
    </>
  );
};

export default CamperAdd;
