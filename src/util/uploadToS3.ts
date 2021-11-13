import AWS from 'aws-sdk';
import fs from 'fs';

const uploadToS3 = async (fileContent: string, fileName: string) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  const base64str = fileContent.split('data:image/jpeg;base64,')[1];
  // @ts-ignore
  const bitmap = new Buffer.from(base64str, 'base64');
  fs.writeFileSync('covid_image.jpg', bitmap);

  const file = fs.readFileSync('covid_image.jpg');
  const params = {
    Bucket: 'summerfestcovidimages',
    Key: fileName,
    Body: file,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`File uploaded successfully. ${data.Location}`);
    }
  });
};

export default uploadToS3;
