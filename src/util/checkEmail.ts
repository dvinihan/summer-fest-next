import nodemailer from 'nodemailer';
import { Db } from 'mongodb';
import { Camper } from '../../src/types/Camper';

export const checkEmail = async (db: Db, camper: Camper) => {
  if (
    camper.registration !== 'Online' ||
    camper.signed_status !== 'Not Sent' ||
    !camper.parent_email
  ) {
    return;
  }

  const { count } = await db
    .collection('counters')
    .findOne({ value: 'waivers' });
  const newCount = count + 1;

  try {
    const transporter = nodemailer.createTransport({
      host: 'box1014.bluehost.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_WAIVER_EMAIL,
        pass: process.env.NEXT_PUBLIC_WAIVER_PASSWORD,
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    await transporter.sendMail({
      from: '"Summer Festival" <waivers@summerfestivalcamp.com>',
      to: camper.parent_email,
      subject: 'Your Summer Festival Registration Waiver',
      text: '',
      html: `<p>Please sign the Summer Festival Waiver Form, <a href='${process.env.NEXT_PUBLIC_BASE_URL}/waiver?id=${newCount}'>linked here.</a></p><p>Thank you!</p><p>Tony Ducklow<br />Summer Festival Camp Director</p>`,
    });

    await db
      .collection('counters')
      .updateOne(
        { value: 'waivers' },
        { $set: { value: 'waivers', count: newCount } }
      );
  } catch (error) {
    throw error;
  }

  try {
    await db
      .collection('campers')
      .updateOne({ id: camper.id }, { $set: { signed_status: 'Emailed' } });
  } catch (error) {
    throw error;
  }
};
