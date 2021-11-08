import axios from 'axios';

export const fetchAllUsers = async (accessToken: string) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/users`,
    { headers: { authorization: `Bearer ${accessToken}` } }
  );
  return data;
};
