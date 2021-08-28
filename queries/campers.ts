import axios from 'axios';
import { useMutation } from 'react-query';
import Camper from '../models/Camper';

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

/**
 *
 * @param camperId
 * @returns an async function which returns a list of campers that have the provided id
 */
export const fetchCamperById = async (camperId: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/campers?camperId=${camperId}`
  );
  return res.json();
};

/**
 *
 * @returns a function which returns null
 */
export const useEditCamper = () =>
  useMutation((camper: Camper) => axios.post('/api/editCamper', camper));

/**
 *
 * @returns a function which returns null
 */
export const useDeleteCamper = () =>
  useMutation((camperId: number) =>
    axios.delete<null>(`/api/deleteCamper?id=${camperId}`)
  );
