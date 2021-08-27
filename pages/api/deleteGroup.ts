import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../util/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  try {
    await db.collection('groups').deleteOne({ id: req.query.id });
    console.log('1 document deleted');
  } catch (error) {
    throw error;
  }

  res.json({});
};
