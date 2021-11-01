import { getSession, UserProfile, useUser } from '@auth0/nextjs-auth0';
import { GetServerSidePropsContext } from 'next';
import { IS_ADMIN_KEY } from '../constants';

export const useAdmin = () => {
  const { user } = useUser();
  return { user, isAdmin: user?.[IS_ADMIN_KEY] };
};

export const getIsAdmin = (context: GetServerSidePropsContext) => {
  const { user } = getSession(context.req, context.res);
  return user?.[IS_ADMIN_KEY];
};
