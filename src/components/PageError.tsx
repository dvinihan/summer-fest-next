import { Container, Paper, Typography } from '@mui/material';
import { PageHeader } from './PageHeader';

const PageError = () => (
  <Container maxWidth="xl">
    <PageHeader />
    <div style={{ height: '80px' }}></div>
    <Paper sx={{ padding: '20px' }}>
      <Typography>
        This is not a valid page state. You must have gotten here by accident.
        Hit the back button or return to{' '}
        <a href="https://summer-fest-registration.herokuapp.com/">
          https://summer-fest-registration.herokuapp.com
        </a>
      </Typography>
    </Paper>
  </Container>
);

export default PageError;
