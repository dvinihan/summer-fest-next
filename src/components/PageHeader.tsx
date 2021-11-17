import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Snackbar,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { getIsAdminFromUser } from '../helpers';
import { useNavigate } from '../hooks/useNavigate';
import { useRouter } from 'next/router';
import { useAppContext } from '../context/AppContext';
import Loading from './Loading';

export const PageHeader = () => {
  const router = useRouter();
  const { user } = useUser();
  const { isLoading, setIsLoading, toastMessage, setToastMessage } =
    useAppContext();
  const navigate = useNavigate();

  const isAdmin = getIsAdminFromUser(user);
  const isOnAdminPage = router.pathname === '/admin';

  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  // on any given page, stop the loading spinner when page loads
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setIsNavDrawerOpen(true)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Summer Fest Registration</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
      >
        <List>
          {isAdmin && (
            <ListItemButton
              disabled={isOnAdminPage}
              onClick={() => navigate('/admin')}
            >
              <ListItemText primary="Admin" />
            </ListItemButton>
          )}
          <ListItemButton onClick={() => navigate('/api/auth/logout')}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={6000}
        onClose={() => setToastMessage()}
        message={toastMessage}
      />

      {isLoading && <Loading />}
    </>
  );
};
