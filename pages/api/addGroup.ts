import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { Group } from '../../src/types/Group';
import connectToDatabase from '../../src/util/mongodb';

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const db = await connectToDatabase();

      const { insertedId } = await db
        .collection('groups')
        .insertOne(new Group(req.body));

      const group = await db.collection('groups').findOne({ _id: insertedId });

      res.json({ id: group.id });
    } catch (error) {
      throw error;
    }
  }
);
