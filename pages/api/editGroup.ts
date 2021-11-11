import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import Group from '../../src/types/Group';
import connectToDatabase from '../../src/util/mongodb';

interface EditGroupRequest extends NextApiRequest {
  body: Group;
}

export default withApiAuthRequired(
  async (req: EditGroupRequest, res: NextApiResponse) => {
    const db = await connectToDatabase();

    try {
      await db
        .collection('groups')
        .updateOne({ id: req.body.id }, { $set: new Group(req.body) });
      console.log('1 document updated');
    } catch (error) {
      throw error;
    }

    res.json({});
  }
);
