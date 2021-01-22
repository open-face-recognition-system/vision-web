import React from 'react';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { useHistory } from 'react-router';
import { Student } from '../../../../hooks/student';

interface EnrolledStudentItemProps {
  student: Student;
  handleRemoveStudent: (studentId: number) => Promise<void>;
}

const EnrolledStudentItem: React.FC<EnrolledStudentItemProps> = ({
  student,
  handleRemoveStudent,
}: EnrolledStudentItemProps) => {
  const history = useHistory();

  return (
    <ListItem
      button
      onClick={() => {
        history.push(`/students/${student.id}/details`);
      }}
    >
      <ListItemText primary={student.user.name} />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => {
            handleRemoveStudent(student.id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default EnrolledStudentItem;
