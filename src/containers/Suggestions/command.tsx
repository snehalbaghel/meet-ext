import React from 'react';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import styled from 'styled-components';

const CommandText = styled.span`
  display: inline;
  font-size: 1rem;
  line-height: 1.5;
  color: ${(props) => props.theme.commandRed};
`;

const CommandSuggestionItem: React.FC = () => {
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Google Meet" src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary="Google Meet"
        secondary={
          <>
            <CommandText>meet</CommandText>
            {' — meet <email@gmail.com> <title>'}
          </>
        }
      />
    </ListItem>
  );
};

export default CommandSuggestionItem;
