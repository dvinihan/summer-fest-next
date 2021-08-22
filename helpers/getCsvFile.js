const convertArrayOfObjectsToCSV = (data, isAdmin, groups) => {
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

const getCsvFile = ({ users, groups, campers, isAdmin }) =>
  convertArrayOfObjectsToCSV(users, isAdmin) +
  convertArrayOfObjectsToCSV(groups, isAdmin) +
  convertArrayOfObjectsToCSV(campers, isAdmin, groups);

export default getCsvFile;
