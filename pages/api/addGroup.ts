import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { Group } from '../../src/types/Group';
import connectToDatabase from '../../src/util/mongodb';

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const db = await connectToDatabase();

      const { count } = await db
        .collection('counters')
        .findOne({ collection: 'groups' });
      const newCount = count + 1;

      const newGroup = new Group({ ...req.body, id: newCount });

      await db.collection('groups').insertOne(newGroup);
      await db
        .collection('counters')
        .updateOne({ collection: 'groups' }, { $set: { count: newCount } });

      res.json({ id: newCount });
    } catch (error) {
      throw error;
    }
  }
);
