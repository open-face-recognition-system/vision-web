import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import { Assignment, Subject, Class } from '@material-ui/icons';

import { useHistory } from 'react-router-dom';

export const MainListItems: React.FC = () => {
  const history = useHistory();

  return (
    <div>
      <ListItem button onClick={() => history.push('/subjects')}>
        <ListItemIcon>
          <Subject />
        </ListItemIcon>
        <ListItemText primary="Matérias" />
      </ListItem>
      <ListItem button onClick={() => history.push('/classes')}>
        <ListItemIcon>
          <Class />
        </ListItemIcon>
        <ListItemText primary="Aulas" />
      </ListItem>
    </div>
  );
};

export const SecondaryListItems: React.FC = () => {
  return (
    <div>
      <ListSubheader inset>Saved reports</ListSubheader>
      <ListItem button>
        <ListItemIcon>
          <Assignment />
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Assignment />
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Assignment />
        </ListItemIcon>
        <ListItemText primary="Year-end sale" />
      </ListItem>
    </div>
  );
};
