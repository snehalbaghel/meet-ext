import React from 'react';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import styled from 'styled-components';
import { Token } from '../CommandBox/types';
import { Meta } from '../CommandBox/tokens';
import { getExampleText } from './util';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import EventIcon from '@material-ui/icons/Event';
import ScheduleIcon from '@material-ui/icons/Schedule';

export interface CommandSuggestionProps {
  suggestion: Token<Meta>;
  active: boolean;
}

const CommandText = styled.span`
  display: inline;
  font-size: 1rem;
  line-height: 1.5;
  font-family: 'Ubuntu Mono', monospace;

  color: ${(props) => props.theme.commandRed};
`;

const CommandExample = styled.span`
  font-family: 'Ubuntu Mono', monospace;
  color: black;
  font-size: 1rem;
`;

const CommandImage = styled(Avatar)`
  & > img {
    width: auto;
    height: 24px;
  }
`;

function getSuggestionImage(img: string) {
  switch (img) {
    case 'meet.png':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Meet_icon_%282020%29.svg/200px-Google_Meet_icon_%282020%29.svg.png';
    case 'time.png':
      return <ScheduleIcon />;
    case 'date.png':
      return <EventIcon />;
    case 'duration.png':
      return <HourglassEmptyIcon />;
    default:
  }
}

const CommandSuggestionItem: React.FC<CommandSuggestionProps> = ({
  suggestion,
  active,
}) => {
  let src = null;
  let icon = getSuggestionImage(suggestion.props.icon);

  if (typeof icon === 'string') {
    src = icon;
    icon = undefined;
  }

  return (
    <ListItem
      aria-label="command suggestion item"
      selected={active}
      alignItems="flex-start"
    >
      <ListItemAvatar>
        <CommandImage
          variant="rounded"
          alt={suggestion.props.description}
          src={src || ''}
        >
          {icon && icon}
        </CommandImage>
      </ListItemAvatar>
      <ListItemText
        primary={suggestion.props.description}
        secondary={
          <>
            <CommandText aria-label="command text">
              {suggestion.props.name}
            </CommandText>
            <CommandExample>{` —  ${getExampleText(
              suggestion.props.entity
            )}`}</CommandExample>
          </>
        }
      />
    </ListItem>
  );
};

export default CommandSuggestionItem;
