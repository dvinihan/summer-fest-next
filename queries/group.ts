import axios from 'axios';
import { useMutation } from 'react-query';
import Group from '../models/Group';

/**
 *
 * @returns the new group ID
 */
export const useAddGroup = () =>
  useMutation((newGroup: Group) =>
    axios.post<number>('/api/addGroup', newGroup)
  );

/**
 *
 * @returns null
 */
export const useEditGroup = () =>
  useMutation((editedGroup: Group) =>
    axios.post<null>(`/api/editGroup`, editedGroup)
  );

/**
 *
 * @returns null
 */
export const useDeleteGroup = () =>
  useMutation((groupId: number) =>
    axios.delete<null>(`/api/deleteGroup?id=${groupId}`)
  );
