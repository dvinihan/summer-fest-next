import { Container, Paper, Typography } from '@mui/material';
import { PageHeader } from './PageHeader';

const AdminError = () => {
  return (
    <Container maxWidth="xl">
      <PageHeader />
      <div style={{ height: '80px' }}></div>
      <Paper sx={{ padding: '20px' }}>
        <Typography>Sorry, you must be an admin to view this page.</Typography>
      </Paper>
    </Container>
  );
};

export default AdminError;
