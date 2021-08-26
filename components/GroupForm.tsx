import { Button, Container, Grid, Paper, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import Group from '../models/Group';

interface Props {
  initialGroup?: Group;
  onSave: (group: Group) => void;
}

export const GroupForm = ({ initialGroup, onSave }: Props) => {
  const [group, setGroup] = useState(initialGroup ?? new Group());

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  const handleSave = () => onSave(group);

  return (
    <Paper>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <TextField
            id="standard-basic"
            label="Group"
            onChange={handleChange}
            value={group.group_name}
            name="group_name"
          />
        </Grid>
        <Grid item>
          <TextField
            id="standard-basic"
            label="Leader"
            onChange={handleChange}
            value={group.leader_name}
            name="leader_name"
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GroupForm;
