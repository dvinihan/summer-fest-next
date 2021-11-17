import { NextApiRequest, NextApiResponse } from 'next';
import uploadToS3 from '../../src/util/uploadToS3';
import { Camper } from '../../src/types/Camper';
import connectToDatabase from '../../src/util/mongodb';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { checkEmail } from '../../src/util/checkEmail';

interface AddCamperRequest extends NextApiRequest {
  body: Camper;
}

export default withApiAuthRequired(
  async (req: AddCamperRequest, res: NextApiResponse) => {
    const db = await connectToDatabase();

    let covidFileName = '';
    if (req.body.covid_image) {
      covidFileName = `covid_image_${req.body.first_name}_${
        req.body.last_name
      }_${Math.floor(Math.random() * 10000000000)}.jpg`;

      uploadToS3(req.body.covid_image, covidFileName);
    }

    const { count } = await db
      .collection('counters')
      .findOne({ collection: 'campers' });
    const newCount = count + 1;

    const newCamper = new Camper({
      ...req.body,
      id: newCount,
      covid_image_file_name: covidFileName,
    });

    await db.collection('campers').insertOne(newCamper);
    await db
      .collection('counters')
      .updateOne({ collection: 'campers' }, { $set: { count: newCount } });

    try {
      await checkEmail(db, newCamper);
      res.json({ id: newCount });
    } catch (error) {
      res.json({ id: newCount, emailError: error.message });
    }
  }
);
