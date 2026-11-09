import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { AccountCircle, CalendarToday, Class, People, School, Subject } from '@mui/icons-material';
import type { Role } from '../api';
import { useAuth } from '../auth';

const DRAWER_WIDTH = 220;

const MENU: Record<Exclude<Role, 'student'>, { label: string; path: string; icon: React.ReactNode }[]> = {
  admin: [
    { label: 'Aulas', path: '/classes', icon: <Class /> },
    { label: 'Matérias', path: '/subjects', icon: <Subject /> },
    { label: 'Semestres', path: '/semesters', icon: <CalendarToday /> },
    { label: 'Professores', path: '/teachers', icon: <People /> },
    { label: 'Alunos', path: '/students', icon: <School /> },
  ],
  teacher: [
    { label: 'Aulas', path: '/classes', icon: <Class /> },
    { label: 'Matérias', path: '/subjects', icon: <Subject /> },
  ],
};

export default function Layout() {
  const { user, signOut } = useAuth();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const items = user && user.role !== 'student' ? MENU[user.role] : [];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, letterSpacing: 2 }}>
            VISION
          </Typography>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {user?.name}
          </Typography>
          <IconButton color="inherit" aria-label="Conta" onClick={event => setAnchor(event.currentTarget)}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
            <MenuItem onClick={signOut}>Sair</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        <Toolbar />
        <List>
          {items.map(item => (
            <ListItemButton key={item.path} component={NavLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
