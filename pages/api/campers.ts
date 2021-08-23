import connectToDatabase from '../../util/mongodb';

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const groupId = parseInt(req.query.groupId);
  const query = groupId ? { group_id: groupId } : {};

  const campers = await db.collection('campers').find(query).toArray();
  res.json(campers);
};
