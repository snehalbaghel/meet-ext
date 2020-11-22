import React from 'react';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import styled from 'styled-components';

const PrimaryText = styled.span`
  display: inline;
  font-size: 1rem;
  line-height: 1.5;
  color: #000;
`;

const HistorySuggestionItem: React.FC = () => {
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary="Brunch this weekend?"
        secondary={
          <>
            <PrimaryText>Ali Connors</PrimaryText>
            {" — I'll be in your neighborhood doing errands this…"}
          </>
        }
      />
    </ListItem>
  );
};

export default HistorySuggestionItem;
