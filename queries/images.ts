import axios from 'axios';

export const downloadCovidImage = async ({
  covidImageFileName,
}: {
  covidImageFileName: string;
}) => {
  const { data } = await axios.post<string>(`/api/downloadCovidImage`, {
    covidImageFileName,
  });
  return data;
};
