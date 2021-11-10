import axios from 'axios';

export const fetchAllUsers = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`
  );
  return data.users;
};
