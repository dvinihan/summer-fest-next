import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { data: tokenData } = await axios.post(
    `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
    {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
    },
    { headers: { 'content-type': 'application/json' } }
  );

  const { data: users } = await axios.get(
    `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users`,
    { headers: { authorization: `Bearer ${tokenData.access_token}` } }
  );

  res.json({ users });
};
