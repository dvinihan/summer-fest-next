import connectToDatabase from '../../util/mongodb';

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const updatedGroup = req.body;

  var myquery = { id: updatedGroup.id };
  var newvalues = { $set: updatedGroup };
  db.collection('groups').updateOne(myquery, newvalues, (err, res) => {
    if (err) throw err;
    console.log('1 document updated');
    // db.close();
  });

  res.json({});
};
