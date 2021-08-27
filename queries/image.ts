import axios from 'axios';
import { useMutation } from 'react-query';

/**
 *
 * @returns base64 encoded image as string
 */
export const useDownloadCovidImage = () =>
  useMutation((covidImageFileName: string) =>
    axios.post<string>(`/api/downloadCovidImage`, { covidImageFileName })
  );
