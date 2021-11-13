import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { ADMIN_ROLE_ID } from '../../src/constants';
import { fetchAuthTokens } from '../../src/queries/auth';

interface Request extends NextApiRequest {
  body: { userId: number };
}

export default withApiAuthRequired(
  async (req: Request, res: NextApiResponse) => {
    const tokenData = await fetchAuthTokens();

    const { userId } = req.body;

    await axios.post(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}/roles`,
      { roles: [ADMIN_ROLE_ID] },
      { headers: { authorization: `Bearer ${tokenData.access_token}` } }
    );
    res.json({});
  }
);
