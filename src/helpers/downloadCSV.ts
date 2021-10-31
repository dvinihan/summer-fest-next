import Camper from '../models/Camper';
import Group from '../models/Group';
import User from '../models/User';

const convertArrayOfObjectsToCSV = (data, isAdmin, groups?) => {
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

const downloadCSV = ({
  users,
  groups,
  campers,
  isAdmin = false,
}: {
  users?: User[];
  groups?: Group[];
  campers?: Camper[];
  isAdmin?: boolean;
}) => {
  const csvFile =
    convertArrayOfObjectsToCSV(users, isAdmin) +
    convertArrayOfObjectsToCSV(groups, isAdmin) +
    convertArrayOfObjectsToCSV(campers, isAdmin, groups);

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

export default downloadCSV;
