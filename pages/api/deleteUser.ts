import { NextApiRequest, NextApiResponse } from 'next';
import { getQueryParamId } from '../../helpers/getQueryParamId';
import connectToDatabase from '../../util/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const userId = getQueryParamId(req.query.id);
  try {
    await db.collection('users').deleteOne({ id: userId });
    console.log('1 document deleted');
  } catch (error) {
    throw error;
  }

  res.json({});
};
