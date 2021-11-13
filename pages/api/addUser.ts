import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchAuthTokens } from '../../src/queries/auth';

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const tokenData = await fetchAuthTokens();

    const { name, email } = req.body;

    await axios.post(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`,
      {
        connection: process.env.AUTH0_DATABASE_CONNECTION,
        name,
        email,
      },
      { headers: { authorization: `Bearer ${tokenData.access_token}` } }
    );
    res.json({});
  }
);
