import connectToDatabase from '../../util/mongodb';

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const groupId = parseInt(req.query.groupId);
  const query = groupId ? { group_id: groupId } : {};

  const users = await db.collection('users').find(query).toArray();
  res.json(users);
};
