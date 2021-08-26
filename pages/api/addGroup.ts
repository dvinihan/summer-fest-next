import connectToDatabase from '../../util/mongodb';

export default async (req, res) => {
  const { db } = await connectToDatabase();

  db.collection('groups').insertOne(req.body, (err, res) => {
    if (err) throw err;
    console.log('1 document inserted');
    // db.close();
  });

  res.json({});
};