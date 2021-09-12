import { CircularProgress, Grid, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  gridContainer: {
    height: '100%',
  },
});

interface Props {
  isOpen: boolean;
}

export const Loading = ({ isOpen }: Props) => {
  const classes = useStyles();

  return (
    <Modal open={isOpen}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className={classes.gridContainer}
      >
        <Grid item>
          <CircularProgress size={80} thickness={5} />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Loading;
