import { fetchCampersInGroup } from '../queries/campers';
import { fetchAllUsers } from '../queries/users';
import Camper from '../types/Camper';
import Group from '../types/Group';

const convertArrayOfObjectsToCSV = (
  data: any[],
  isAdmin: boolean,
  groups?: Group[]
) => {
  if (data && data.length > 0) {
    let keys = Object.keys(data[0]);
    keys = keys.filter((key) => key !== 'password');

    if (!isAdmin) {
      keys = keys.filter((key) => key !== 'room');
    }

    if (groups) {
      keys.push('group_name');
    }

    let result = '';
    result += keys.join(',');
    result += '\n';

    data.forEach((item) => {
      let counter = 0;
      keys.forEach((key) => {
        if (counter > 0) {
          result += ',';
        }

        if (groups && key === 'group_name') {
          result += groups.find(
            (group) => group.id === item.group_id
          ).group_name;
        } else {
          result += item[key];
        }
        counter++;
      });
      result += '\n';
    });
    return result;
  }
  return null;
};

export const downloadCSV = async ({
  groups,
  campers,
  isAdmin = false,
}: {
  groups?: Group[];
  campers?: Camper[];
  isAdmin?: boolean;
}) => {
  let csvFile;
  if (isAdmin) {
    const { data: users } = await fetchAllUsers();
    const { data: campers } = await fetchCampersInGroup();
    csvFile =
      convertArrayOfObjectsToCSV(users, isAdmin) +
      convertArrayOfObjectsToCSV(groups, isAdmin) +
      convertArrayOfObjectsToCSV(campers, isAdmin, groups);
  } else {
    csvFile = convertArrayOfObjectsToCSV(campers, isAdmin);
  }

  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8${encodeURIComponent(csvFile)}`
  );
  element.setAttribute('download', 'registration-data.csv');
  element.style.display = 'none';
  if (typeof element.download !== 'undefined') {
    // browser has support - process the download
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
};
