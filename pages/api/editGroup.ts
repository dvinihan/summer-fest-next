import { NextApiRequest, NextApiResponse } from 'next';
import Group from '../../models/Group';
import connectToDatabase from '../../util/mongodb';

interface EditGroupRequest extends NextApiRequest {
  body: Group;
}

export default async (req: EditGroupRequest, res: NextApiResponse) => {
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
};
