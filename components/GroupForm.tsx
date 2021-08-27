import { Button, Grid, Modal, Paper, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { getActiveUserClearance } from '../helpers';
import Group from '../models/Group';
import User from '../models/User';

interface Props {
  initialGroup?: Group;
  onDeleteGroup?: (groupId: number) => void;
  onSave: (group: Group) => void;
  groupUser?: User;
}

export const GroupForm = ({
  initialGroup,
  onDeleteGroup,
  onSave,
  groupUser,
}: Props) => {
  const [group, setGroup] = useState(initialGroup ?? new Group());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // to handle data hydration from react-query
  useEffect(() => {
    console.log(initialGroup);
    setGroup(initialGroup);
  }, [initialGroup]);

  const activeUserClearance = getActiveUserClearance();

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  return (
    <Paper>
      <Grid container justifyContent="center" alignItems="center">
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

      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Button variant="contained" onClick={() => onSave(group)}>
            Save
          </Button>
        </Grid>
        {onDeleteGroup && activeUserClearance === 'admin' && (
          <Grid item>
            <Button onClick={() => setShowDeleteModal(true)}>Delete</Button>
          </Grid>
        )}
      </Grid>

      {showDeleteModal && (
        <Modal open>
          <>
            <h1>
              Are you sure you want to PERMANENTLY delete{' '}
              {initialGroup.group_name} and all its campers
              {groupUser && (
                <span>, along with the user {groupUser.username}</span>
              )}
              ?
            </h1>
            <Button onClick={() => setShowDeleteModal(false)}>No</Button>
            <Button onClick={() => onDeleteGroup(group.id)}>Yes</Button>
          </>
        </Modal>
      )}
    </Paper>
  );
};

export default GroupForm;
