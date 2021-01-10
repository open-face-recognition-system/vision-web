import React, { useEffect } from 'react';
import clsx from 'clsx';
import {
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { useAuth } from '../../hooks/auth';

import { MainListItems, SecondaryListItems } from './listitems';

import { useStyles } from './styles';

const DefaultLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  const { signOut, refreshToken } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(true);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    async function refreshNewToken(): Promise<void> {
      try {
        await refreshToken();
      } catch {
        signOut();
      }
    }

    refreshNewToken();
  }, [refreshToken, signOut]);

  const handleMenu = (e: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleSignOut = (): void => {
    signOut();
    setAnchorEl(null);
  };

  const handleDrawerOpen = (): void => {
    setOpen(true);
  };
  const handleDrawerClose = (): void => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden,
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            OFRS - Open Face Recognition System
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={menuOpen}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Perfil</MenuItem>
              <MenuItem onClick={handleSignOut}>Sair</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MainListItems />
        </List>
        <Divider />
        <List>{SecondaryListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container>{children}</Grid>
        </Container>
      </main>
    </div>
  );
};

export default DefaultLayout;
