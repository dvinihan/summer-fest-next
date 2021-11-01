import { NextApiRequest, NextApiResponse } from 'next';
import Group from '../../src/types/Group';
import connectToDatabase from '../../src/util/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  try {
    const { insertedId } = await db
      .collection('groups')
      .insertOne(new Group(req.body));
    console.log('1 document inserted');

    const group = await db.collection('groups').findOne({ _id: insertedId });

    res.json(group.id);
  } catch (error) {
    throw error;
  }
};
