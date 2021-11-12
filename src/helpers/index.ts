import { Claims, getSession } from '@auth0/nextjs-auth0';
import { GetServerSidePropsContext } from 'next';
import { ADMIN } from '../constants';

export const getIsAdminFromContext = (
  context: GetServerSidePropsContext
): boolean => {
  const { user } = getSession(context.req, context.res) ?? {};
  return getIsAdminFromUser(user);
};

export const getIsAdminFromUser = (user: Claims = {}): boolean => {
  const roles = user['https://summer-fest.com/roles'];
  return Boolean(roles?.includes(ADMIN));
};

export const getUserGroupId = (
  context: GetServerSidePropsContext
): number | undefined => {
  const { user = {} } = getSession(context.req, context.res) ?? {};
  return user['https://summer-fest.com/groupId'];
};
