import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { getQueryParamId } from '../../src/helpers/getQueryParamId';
import connectToDatabase from '../../src/util/mongodb';

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await connectToDatabase();

    const userId = getQueryParamId(req.query.id);
    try {
      await db.collection('users').deleteOne({ id: userId });
    } catch (error) {
      throw error;
    }

    res.json({});
  }
);
