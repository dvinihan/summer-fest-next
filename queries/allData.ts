/**
 *
 * @returns an async function which returns an object with lists of all campers, groups, and users
 */
export const fetchAllData = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/allData`);
  return res.json();
};
