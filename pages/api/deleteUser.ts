import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchAuthTokens } from '../../src/queries/auth';

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const tokenData = await fetchAuthTokens();

    const { id } = req.query;

    await axios.delete(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${id}`,
      { headers: { authorization: `Bearer ${tokenData.access_token}` } }
    );
    res.json({});
  }
);
