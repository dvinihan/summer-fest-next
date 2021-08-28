import { NextApiRequest, NextApiResponse } from 'next';
import Camper from '../../models/Camper';
import connectToDatabase from '../../util/mongodb';

interface EditCamperRequest extends NextApiRequest {
  body: Camper;
}

export default async (req: EditCamperRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  try {
    await db
      .collection('campers')
      .updateOne({ id: req.body.id }, { $set: new Camper(req.body) });
    console.log('1 document updated');
  } catch (error) {
    throw error;
  }

  res.json({});
};
