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

export const PageHeader = () => {
  const router = useRouter();

  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  const openNavDrawer = () => setIsNavDrawerOpen(true);
  const closeNavDrawer = () => setIsNavDrawerOpen(false);

  const handleLogout = () => {
    router.push('/api/auth/logout');
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
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
};
