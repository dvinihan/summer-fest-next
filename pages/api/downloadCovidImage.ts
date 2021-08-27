import AWS from 'aws-sdk';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: 'summerfestcovidimages',
    Key: req.body.covidImageFileName,
  };

  s3.getObject(params, (err, data) => {
    if (err) console.error(err);

    // @ts-ignore
    fs.writeFileSync(req.body.covidImageFileName, data.Body);

    const image = fs.readFileSync(req.body.covidImageFileName);
    const encodedImage = image.toString('base64');
    res.status(200).send(JSON.stringify(encodedImage));
  });
};
