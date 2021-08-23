import connectToDatabase from '../../util/mongodb';

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const groupId = parseInt(req.query.id);
  const query = groupId ? { id: groupId } : {};

  const groups = await db.collection('groups').find(query).toArray();
  res.json(groups);
};
