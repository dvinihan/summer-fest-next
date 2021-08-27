/**
 *
 * @param groupId
 * @returns an async function which returns a list of campers with the provided group id
 */
export const fetchCampersInGroup = async (groupId: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/campers?groupId=${groupId}`
  );
  return res.json();
};
