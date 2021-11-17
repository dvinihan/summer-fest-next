import { fetchAllCampers } from '../queries/campers';
import { fetchAllUsers } from '../queries/users';
import { Camper } from '../types/Camper';
import { Group } from '../types/Group';

const buildSingleRowString = (keys: string[], item: any, groupName?: string) =>
  keys
    .map((key) => item[key])
    .join(',')
    .concat(groupName ? `,${groupName}` : '');

const convertDataToCsvString = ({
  data = [],
  filterFn,
  groups,
}: {
  data: any[];
  filterFn?: (key: string) => boolean;
  groups?: Group[];
}) => {
  if (data.length === 0) {
    return '';
  }

  const dataFilterFunction = filterFn ?? (() => true);
  const keysToInclude = Object.keys(data[0])
    .filter(dataFilterFunction)
    .filter((key) => key !== '_id');

  const headerRowString = keysToInclude
    .join(',')
    .concat(groups ? ',group_name' : '');

  const dataRowStrings = data.map((item) => {
    const groupName = groups?.find(
      (group) => group.id === item.group_id
    )?.group_name;

    return buildSingleRowString(keysToInclude, item, groupName);
  });

  return [headerRowString, ...dataRowStrings].join('\n');
};

export const downloadCSV = async ({
  groups,
  campers,
  isAdmin,
}: {
  groups?: Group[];
  campers?: Camper[];
  isAdmin?: boolean;
}) => {
  const csvStrings = [];

  // add users and groups
  if (isAdmin) {
    const users = await fetchAllUsers();
    const userDataString = convertDataToCsvString({
      data: users,
      filterFn: (key: string) =>
        [
          'created_at',
          'email',
          'email_verified',
          'family_name',
          'given_name',
        ].includes(key),
    });
    const groupsDataString = convertDataToCsvString({ data: groups });
    csvStrings.push(userDataString, groupsDataString);
  }

  // add campers
  if (!campers) {
    campers = await fetchAllCampers();
  }
  const campersDataString = convertDataToCsvString({
    data: campers,
    filterFn: (key: string) => !(!isAdmin && key === 'room'),
    groups,
  });
  csvStrings.push(campersDataString);

  const csvStringWithNewlines = csvStrings.join('\n\n');

  const encodedUri = encodeURI(
    'data:text/csv;charset=utf-8,' + csvStringWithNewlines
  );
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'registration-data.csv');
  document.body.appendChild(link); // Required for FF
  link.click();
};
