import { NextApiRequest, NextApiResponse } from 'next';
import { getQueryParamId } from '../../src/helpers/getQueryParamId';
import connectToDatabase from '../../src/util/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const groupId = getQueryParamId(req.query.id);
  const query = groupId ? { id: groupId } : {};

  const groups = await db.collection('groups').find(query).toArray();
  res.json(JSON.parse(JSON.stringify(groups)));
};
