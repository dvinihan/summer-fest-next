import axios from 'axios';

type AuthTokensResponse = {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
};

export const fetchAuthTokens = async (): Promise<AuthTokensResponse> => {
  const { data } = await axios.post(
    `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
    {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
    },
    { headers: { 'content-type': 'application/json' } }
  );
  return data;
};
