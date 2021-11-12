import axios from 'axios';

export const fetchAllGroups = async (sessionCookie?: string) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/groups`,
    sessionCookie ? { headers: { Cookie: sessionCookie } } : undefined
  );
  return data;
};

export const fetchGroupById = async (
  groupId: number,
  sessionCookie?: string
) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/groups?id=${groupId}`,
    sessionCookie ? { headers: { Cookie: sessionCookie } } : undefined
  );
  return data[0] ?? null;
};
