import axios from 'axios';
import { fetchAuthTokens } from './auth';

export const fetchAllUsers = async ({
  sessionCookie,
}: {
  sessionCookie: string;
}) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
    { headers: { Cookie: sessionCookie } }
  );
  return data;
};

export const fetchUserRoles = async ({
  sessionCookie,
}: {
  sessionCookie: string;
}) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/userRoles`,
    {
      headers: { Cookie: sessionCookie },
    }
  );
  return data;
};
