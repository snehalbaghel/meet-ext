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
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

export interface CommandSuggestionProps {
  suggestion: Token<Meta>;
  active: boolean;
  id: string;
}

const CommandText = styled.span`
  display: inline;
  font-size: 1rem;
  line-height: 1.5;
  font-family: 'Ubuntu Mono', monospace;

  color: ${(props) => props.theme.commandBlue};
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
    case 'login.png':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png';
    case 'email.png':
      return <AlternateEmailIcon />;
    case 'auth.png':
      return <VpnKeyIcon />;
    default:
      return img;
  }
}

const CommandSuggestionItem: React.FC<CommandSuggestionProps> = ({
  suggestion,
  active,
  id,
}) => {
  let src = null;
  let icon = getSuggestionImage(suggestion.props.icon);

  if (typeof icon === 'string') {
    src = icon;
    icon = '';
  }

  return (
    <ListItem
      aria-label="command suggestion item"
      selected={active}
      autoFocus={true}
      alignItems="flex-start"
      id={id}
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
