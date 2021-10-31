import { NextApiRequest, NextApiResponse } from 'next';
import { getQueryParamId } from '../../src/helpers/getQueryParamId';
import connectToDatabase from '../../src/util/mongodb';

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
