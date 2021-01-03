import React from 'react';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

const EnrolledStudentItem: React.FC = () => {
  return (
    <ListItem
      button
      onClick={() => {
        console.log('clicked');
      }}
    >
      <ListItemText primary="Single-line item" />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default EnrolledStudentItem;
