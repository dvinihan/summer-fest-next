import axios from 'axios';

export const fetchGroupsById = async (groupId: number) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/groups?id=${groupId}`
  );
  return data;
};
