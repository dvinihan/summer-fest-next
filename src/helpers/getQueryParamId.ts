export const getQueryParamId = (queryParam?: string | string[]) => {
  if (queryParam === undefined) {
    return undefined;
  }
  if (typeof queryParam === 'string') {
    return parseInt(queryParam);
  }

  // else it must be an array. We only care about one ID
  return parseInt(queryParam[0]);
};
