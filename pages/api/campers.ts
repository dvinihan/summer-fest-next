import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../src/util/mongodb';

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await connectToDatabase();

    const groupId = req.query.group_id;
    const query = groupId ? { group_id: groupId } : {};

    const campers = await db.collection('campers').find(query).toArray();
    res.json(JSON.parse(JSON.stringify(campers)));
  }
);
