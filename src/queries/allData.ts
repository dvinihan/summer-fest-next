import axios from 'axios';

export const fetchAllData = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/allData`
  );
  return data;
};
