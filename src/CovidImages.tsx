import { useEffect, useState } from 'react';
import { Button, Grid, InputLabel } from '@mui/material';
import ImageViewer from 'react-simple-image-viewer';
import axios from 'axios';

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

  // on first load, download file name if it already exists
  useEffect(() => {
    if (oldImageFileName) {
      axios.post('/api/downloadCovidImage', oldImageFileName).then((res) => {
        const image = `data:image/jpeg;base64,${res.data.encodedImage}`;
        setOldCovidImage(image);
      });
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    console.log(file);
    if (e.target.files[0].type !== 'image/jpeg') {
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
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <InputLabel>COVID Image</InputLabel>
      </Grid>

      {isEditingCamper && (
        <Grid item>
          <p>Current file: {newImageFileName}</p>
          <Button onClick={() => setIsViewerOpenOldPic(true)}>
            <img src={oldCovidImage} width="300px" />
          </Button>

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

          <Grid item>
            <Button onClick={() => setIsViewerOpenNewPic(true)}>
              <img src={newCovidImage} width="300px" />
            </Button>
          </Grid>

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
