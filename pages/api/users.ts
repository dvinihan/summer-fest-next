import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../util/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const groupId = req.query.groupId;
  const query = groupId ? { group_id: groupId } : {};

  const users = await db.collection('users').find(query).toArray();
  res.json(JSON.parse(JSON.stringify(users)));
};
