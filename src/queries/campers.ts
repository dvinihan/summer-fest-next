import axios from 'axios';

export const fetchCampersInGroup = async (
  groupId: number,
  sessionCookie?: string
) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/campers?groupId=${groupId}`,
    sessionCookie ? { headers: { Cookie: sessionCookie } } : undefined
  );
  return data;
};

export const fetchCamperById = async (
  camperId: number,
  sessionCookie?: string
) => {
  const { data: camperList } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/campers?id=${camperId}`,
    sessionCookie ? { headers: { Cookie: sessionCookie } } : undefined
  );
  return camperList[0];
};
