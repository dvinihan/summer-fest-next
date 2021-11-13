import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { Camper } from '../../src/types/Camper';
import { checkEmail } from '../../src/util/checkEmail';
import connectToDatabase from '../../src/util/mongodb';
import uploadToS3 from '../../src/util/uploadToS3';

interface EditCamperRequest extends NextApiRequest {
  body: Camper;
}

export default withApiAuthRequired(
  async (req: EditCamperRequest, res: NextApiResponse) => {
    const db = await connectToDatabase();

    let covidFileName = '';
    if (req.body.covid_image) {
      covidFileName = `covid_image_${req.body.first_name}_${
        req.body.last_name
      }_${Math.floor(Math.random() * 10000000000)}.jpg`;

      uploadToS3(req.body.covid_image, covidFileName);
    }

    const camper = new Camper({
      ...req.body,
      covid_image_file_name: covidFileName,
    });

    try {
      await db.collection('campers').updateOne(
        { id: req.body.id },
        {
          $set: camper,
        }
      );
      console.log('1 document updated');
      await checkEmail(db, camper);
    } catch (error) {
      throw error;
    }

    res.json({});
  }
);
