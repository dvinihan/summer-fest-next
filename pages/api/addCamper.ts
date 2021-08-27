import { Db } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import uploadToS3 from '../../helpers/uploadToS3';
import Camper from '../../models/Camper';
import connectToDatabase from '../../util/mongodb';

const transporter = nodemailer.createTransport({
  host: 'box1014.bluehost.com',
  port: 465,
  secure: true,
  auth: {
    user: 'waivers@summerfestivalcamp.com',
    pass: 'hDy>T(Zz}hp&sN6',
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

const checkEmail = async (db: Db, camper: Camper) => {
  if (
    camper.registration !== 'Online' ||
    camper.signed_status !== 'Not Sent' ||
    !camper.parent_email
  ) {
    return;
  }

  const id = camper.id * 73648;

  try {
    await transporter.sendMail({
      from: '"Summer Festival" <waivers@summerfestivalcamp.com>',
      to: camper.parent_email,
      subject: 'Your Summer Festival Registration Waiver',
      text: '',
      html: `<p>Please sign the Summer Festival Waiver Form, <a href='https://summer-fest-registration.herokuapp.com/waiver?id=${id}'>linked here.</a></p><p>Thank you!</p><p>Tony Ducklow<br />Summer Festival Camp Director</p>`,
    });
  } catch (error) {
    throw error;
  }

  try {
    await db
      .collection('campers')
      .updateOne({ id: camper.id }, { $set: { signed_status: 'Emailed' } });
    console.log('1 document updated');
  } catch (error) {
    throw error;
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { client, db } = await connectToDatabase();

  let covidFileName = '';
  if (req.body.covid_image) {
    covidFileName = `covid_image_${req.body.first_name}_${
      req.body.last_name
    }_${Math.floor(Math.random() * 10000000000)}.jpg`;

    uploadToS3(req.body.covid_image, covidFileName);
  }

  try {
    await db
      .collection('campers')
      .insertOne({ ...req.body, covid_image_file_name: covidFileName });
    console.log('1 document inserted');
  } catch (error) {
    throw error;
  }

  const newCamperDoc = await db
    .collection('campers')
    .findOne({ id: req.body.id });

  await checkEmail(db, JSON.parse(JSON.stringify(newCamperDoc)));

  await client.close();
  res.json({});
};
