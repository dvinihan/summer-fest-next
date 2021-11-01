import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAdmin } from '../hooks/useAdmin';

export const PageHeader = () => {
  const router = useRouter();
  const { isAdmin } = useAdmin();

  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  const openNavDrawer = () => setIsNavDrawerOpen(true);
  const closeNavDrawer = () => setIsNavDrawerOpen(false);

  const handleNav = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" onClick={openNavDrawer} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Summer Fest Registration</Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isNavDrawerOpen} onClose={closeNavDrawer}>
        <List>
          {isAdmin && (
            <ListItemButton onClick={() => handleNav('/admin')}>
              <ListItemText primary="Admin" />
            </ListItemButton>
          )}
          <ListItemButton onClick={() => handleNav('/api/auth/logout')}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
};
