import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

interface Request extends NextApiRequest {
  body: { userId: number };
}

export default withApiAuthRequired(
  async (req: Request, res: NextApiResponse) => {
    res.json({ userName: '' });
  }
);
