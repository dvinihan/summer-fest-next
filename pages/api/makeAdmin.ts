import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../src/util/mongodb';

interface Request extends NextApiRequest {
  body: { userId: number };
}

export default withApiAuthRequired(
  async (req: Request, res: NextApiResponse) => {
    const db = await connectToDatabase();

    try {
      await db
        .collection('users')
        .updateOne({ id: req.body.userId }, { $set: { status: 'admin' } });
      console.log('1 document updated');
    } catch (error) {
      throw error;
    }

    res.json({});
  }
);
