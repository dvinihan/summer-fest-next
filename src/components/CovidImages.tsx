import { useEffect, useState } from 'react';
import { Button, Grid, InputLabel } from '@mui/material';
import ImageViewer from 'react-simple-image-viewer';
import { useMutation } from 'react-query';
import { downloadCovidImage } from '../queries/images';
import Image from 'next/image';
import { useMakeMutationOptions } from '../hooks/useMakeMutationOptions';

interface Props {
  oldImageFileName: string;
  newImageFileName: string;
  setImage: (image: string) => void;
  isEditingCamper: boolean;
}

const CovidImages = ({
  oldImageFileName,
  newImageFileName,
  setImage,
  isEditingCamper,
}: Props) => {
  const [showFileTypeError, setShowFileTypeError] = useState(false);
  const [isViewerOpenOldPic, setIsViewerOpenOldPic] = useState(false);
  const [isViewerOpenNewPic, setIsViewerOpenNewPic] = useState(false);
  const [oldCovidImage, setOldCovidImage] = useState('');
  const [newCovidImage, setNewCovidImage] = useState('');
  const makeMutationOptions = useMakeMutationOptions();

  const { mutate, data } = useMutation(
    downloadCovidImage,
    makeMutationOptions()
  );

  // on first load, download file if it already exists
  useEffect(() => {
    if (oldImageFileName) {
      mutate({ covidImageFileName: oldImageFileName });
    }
  }, [mutate, oldImageFileName]);
  useEffect(() => {
    if (data) {
      const image = `data:image/jpeg;base64,${data}`;
      setOldCovidImage(image);
    }
  }, [data]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file.type !== 'image/jpeg') {
      setShowFileTypeError(true);
      return;
    }
    setShowFileTypeError(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage = reader.result.toString();
      setNewCovidImage(newImage);
      setImage(newImage);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <InputLabel>COVID Image</InputLabel>
      </Grid>

      {isEditingCamper && (
        <Grid item>
          <p>Current file: {newImageFileName}</p>

          {oldCovidImage && (
            <Button onClick={() => setIsViewerOpenOldPic(true)}>
              <Image src={oldCovidImage} alt="old covid image" width="300px" />
            </Button>
          )}

          {isViewerOpenOldPic && (
            <Grid item>
              <ImageViewer
                src={[oldCovidImage]}
                currentIndex={0}
                onClose={() => setIsViewerOpenOldPic(false)}
                backgroundStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                }}
              />
            </Grid>
          )}

          {newCovidImage && (
            <Grid item>
              <Button onClick={() => setIsViewerOpenNewPic(true)}>
                <Image
                  src={newCovidImage}
                  alt="new covid image"
                  width="300px"
                />
              </Button>
            </Grid>
          )}

          {isViewerOpenNewPic && (
            <Grid item>
              <ImageViewer
                src={[newCovidImage]}
                currentIndex={0}
                onClose={() => setIsViewerOpenNewPic(false)}
                backgroundStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                }}
              />
            </Grid>
          )}
        </Grid>
      )}

      <Grid item>
        <input
          style={{ marginTop: '15px' }}
          onChange={handleImageUpload}
          type="file"
          accept="image/jpeg"
          title="one"
        />
        {showFileTypeError && (
          <p className="camper-input-error">
            Only JPG image files are supported
          </p>
        )}
      </Grid>
    </Grid>
  );
};

export default CovidImages;
