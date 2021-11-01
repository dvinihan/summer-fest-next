import { Container, Typography } from '@mui/material';
import { PageHeader } from './PageHeader';

const AdminError = () => {
  return (
    <Container maxWidth="xl">
      <PageHeader />
      <div style={{ height: '80px' }}></div>
      <Typography>Sorry, you must be an admin to view this page.</Typography>
    </Container>
  );
};

export default AdminError;
