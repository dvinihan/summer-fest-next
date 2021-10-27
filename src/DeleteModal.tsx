import { Button, Grid, Modal, Paper, useTheme } from '@mui/material';

interface Props {
  message: string;
  onDecline: () => void;
  onAccept: () => void;
}

const DeleteModal = ({ message, onAccept, onDecline }: Props) => {
  const theme = useTheme();

  return (
    <Modal open>
      <Paper sx={{ margin: theme.spacing(2), padding: theme.spacing(2) }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <h1>{message}</h1>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid item>
            <Button variant="contained" onClick={onDecline}>
              No
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={onAccept}>
              Yes
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default DeleteModal;
