import connectToDatabase from '../../util/mongodb';

export default async (req, res) => {
  const { db } = await connectToDatabase();

  db.collection('groups').deleteOne(req.query.id, {}, (err, res) => {
    if (err) throw err;
    console.log('1 document deleted');
    // db.close();
  });

  res.json({});
};
