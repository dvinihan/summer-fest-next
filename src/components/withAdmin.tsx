import AdminError from '../components/AdminError';

export const withAdmin = (WrappedComponent: any) => (props: any) => {
  const { isAdmin } = props;
  return isAdmin ? <WrappedComponent {...props} /> : <AdminError />;
};
