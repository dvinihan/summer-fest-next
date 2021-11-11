import axios from 'axios';

export const fetchCampersInGroup = async ({
  sessionCookie,
  groupId,
}: {
  sessionCookie: string;
  groupId?: number;
}) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/campers?groupId=${groupId}`,
    { headers: { Cookie: sessionCookie } }
  );
  return data;
};

export const fetchCamperById = async ({
  sessionCookie,
  camperId,
}: {
  sessionCookie: string;
  camperId: number;
}) => {
  const { data: camperList } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/campers?camperId=${camperId}`,
    { headers: { Cookie: sessionCookie } }
  );
  return camperList[0];
};
