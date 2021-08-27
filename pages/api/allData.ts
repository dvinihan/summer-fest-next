import connectToDatabase from '../../util/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const groups = await db.collection('groups').find({}).toArray();
  const campers = await db.collection('campers').find({}).toArray();
  const users = await db.collection('users').find({}).toArray();

  res.json({
    groups: JSON.parse(JSON.stringify(groups)),
    campers: JSON.parse(JSON.stringify(campers)),
    users: JSON.parse(JSON.stringify(users)),
  });
};
