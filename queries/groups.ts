import axios from 'axios';
import { useMutation } from 'react-query';
import Group from '../models/Group';

/**
 *
 * @param groupId
 * @returns an async function which returns a list of groups that have the provided group id
 */
export const fetchGroupsById = async (groupId: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/groups?id=${groupId}`
  );
  return res.json();
};
/**
 *
 * @returns a function which returns the new group ID
 */
export const useAddGroup = () =>
  useMutation((newGroup: Group) =>
    axios.post<number>('/api/addGroup', newGroup)
  );

/**
 *
 * @returns a function which returns null
 */
export const useEditGroup = () =>
  useMutation((editedGroup: Group) =>
    axios.post<null>(`/api/editGroup`, editedGroup)
  );

/**
 *
 * @returns a function which returns null
 */
export const useDeleteGroup = () =>
  useMutation((groupId: number) =>
    axios.delete<null>(`/api/deleteGroup?id=${groupId}`)
  );
