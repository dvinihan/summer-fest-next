import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { ADMIN_ROLE_ID } from '../../src/constants';
import { fetchAuthTokens } from '../../src/queries/auth';

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const tokenData = await fetchAuthTokens();

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/roles/${ADMIN_ROLE_ID}/users`,
      { headers: { authorization: `Bearer ${tokenData.access_token}` } }
    );

    res.json(JSON.parse(JSON.stringify(data)));
  }
);
