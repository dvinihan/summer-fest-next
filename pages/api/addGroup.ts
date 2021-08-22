import fillNulls from '../../helpers/fillNulls';
import Group from '../../models/Group';
import connectToDatabase from '../../util/mongodb';

export default async (req, res) => {
  const { db, client } = await connectToDatabase();

  // const body = fillNulls(req.body);
  // console.log(body);

  // const newGroup = body as Group;
  console.log(req.body);

  db.collection('groups').insertOne(req.body, (err, res) => {
    if (err) throw err;
    console.log('1 document inserted');
    // client.close();
  });

  res.json({});
};
