import { Button, Grid, Modal, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: any) => ({
  button: {
    padding: theme.spacing(1),
  },
  modal: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

interface Props {
  message: string;
  onDecline: () => void;
  onAccept: () => void;
}

const DeleteModal = ({ message, onAccept, onDecline }: Props) => {
  const classes = useStyles();

  return (
    <Modal open>
      <Paper className={classes.modal}>
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
