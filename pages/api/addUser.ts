import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../src/types/User';
import connectToDatabase from '../../src/util/mongodb';

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await connectToDatabase();

    try {
      const { insertedId } = await db
        .collection('users')
        .insertOne(new User(req.body));
      console.log('1 document inserted');

      const user = await db.collection('users').findOne({ _id: insertedId });

      res.json(user.id);
    } catch (error) {
      throw error;
    }
  }
);
