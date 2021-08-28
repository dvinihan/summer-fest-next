import { NextApiRequest, NextApiResponse } from 'next';
import getQueryParamId from '../../helpers/getQueryParamId';
import connectToDatabase from '../../util/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const camperId = getQueryParamId(req.query.id);
  try {
    await db.collection('campers').deleteOne({ id: camperId });
    console.log('1 document deleted');
  } catch (error) {
    throw error;
  }

  res.json({});
};
