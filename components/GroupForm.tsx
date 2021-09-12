import {
  Button,
  Container,
  Grid,
  Modal,
  Paper,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { getActiveUserClearance } from '../helpers';
import Group from '../models/Group';
import User from '../models/User';
import DeleteModal from './DeleteModal';

interface Props {
  initialGroup?: Group;
  onDeleteGroup?: (groupId: number) => void;
  onSave: (group: Group) => void;
  groupUser?: User;
}

const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(2),
  },
  button: {
    padding: theme.spacing(1),
  },
  modal: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

export const GroupForm = ({
  initialGroup,
  onDeleteGroup,
  onSave,
  groupUser,
}: Props) => {
  const classes = useStyles();
  const [group, setGroup] = useState(initialGroup ?? new Group());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const activeUserClearance = getActiveUserClearance();

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  const userDeleteMessage = groupUser
    ? `, along with the user ${groupUser.username}`
    : '';
  const deleteMessage = `Are you sure you want to PERMANENTLY delete ${initialGroup.group_name} and all its campers${userDeleteMessage}?`;

  return (
    <Paper className={classes.root}>
      <Container>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={4}
            >
              <Grid item>
                <TextField
                  label="Group"
                  onChange={handleChange}
                  value={group.group_name}
                  name="group_name"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Leader"
                  onChange={handleChange}
                  value={group.leader_name}
                  name="leader_name"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Button variant="contained" onClick={() => onSave(group)}>
                  Save
                </Button>
              </Grid>
              {onDeleteGroup && (
                // && activeUserClearance === 'admin'
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {showDeleteModal && (
          <DeleteModal
            message={deleteMessage}
            onAccept={() => onDeleteGroup(group.id)}
            onDecline={() => setShowDeleteModal(false)}
          />
        )}
      </Container>
    </Paper>
  );
};

export default GroupForm;
