import { CircularProgress, Grid, Modal } from '@mui/material';

export const Loading = () => {
  return (
    <Modal open>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        <Grid item>
          <CircularProgress size={80} thickness={5} />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Loading;
