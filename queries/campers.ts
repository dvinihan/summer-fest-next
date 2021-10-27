import axios from 'axios';

export const fetchCampersInGroup = async (groupId: number) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/campers?groupId=${groupId}`
  );
  return data;
};

export const fetchCamperById = async (camperId: number) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/campers?camperId=${camperId}`
  );
  return data;
};
