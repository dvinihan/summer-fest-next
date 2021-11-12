import axios from 'axios';

export const fetchAllUsers = async (sessionCookie?: string) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
    sessionCookie ? { headers: { Cookie: sessionCookie } } : undefined
  );
  return data;
};
