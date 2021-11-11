import axios from 'axios';

export const fetchGroupsById = async ({
  sessionCookie,
  groupId,
}: {
  sessionCookie: string;
  groupId?: number;
}) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/groups?id=${groupId}`,
    { headers: { Cookie: sessionCookie } }
  );
  return data;
};
