import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import Group from '../types/Group';
import DeleteModal from './DeleteModal';

interface Props {
  initialGroup?: Group;
  onDeleteGroup?: () => void;
  onSave: (group: Group) => void;
}

export const GroupForm = ({ initialGroup, onDeleteGroup, onSave }: Props) => {
  const theme = useTheme();
  const [group, setGroup] = useState(initialGroup ?? new Group());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isAdmin = useAdmin();

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    onDeleteGroup();
    setShowDeleteModal(false);
  };

  return (
    <Paper sx={{ padding: theme.spacing(2) }}>
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
              {onDeleteGroup && isAdmin && (
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
            message={`Are you sure you want to PERMANENTLY delete ${initialGroup.group_name} and all its campers?`}
            onAccept={handleDelete}
            onDecline={() => setShowDeleteModal(false)}
          />
        )}
      </Container>
    </Paper>
  );
};

export default GroupForm;
