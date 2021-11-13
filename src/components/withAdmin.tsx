import AdminError from '../components/AdminError';

// eslint-disable-next-line react/display-name
export const withAdmin = (WrappedComponent: any) => (props: any) => {
  const { isAdmin } = props;
  return isAdmin ? <WrappedComponent {...props} /> : <AdminError />;
};
