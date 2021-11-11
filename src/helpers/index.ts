export const getIsAdmin = (userRoles: [{ name: string }]) =>
  Boolean(userRoles.find((role) => role.name === 'Admin'));
