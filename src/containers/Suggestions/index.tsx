import React from 'react';
import HistorySuggestionItem from './history';
import CommandSuggestionItem from './command';
import { Meta } from '../CommandBox/tokens';
import { Token } from '../CommandBox/types';

export interface SuggestionsProps {
  suggestions: Token<Meta>[];
  active: number;
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions, active }) => {
  return (
    <>
      {suggestions.map((s, i) => (
        <CommandSuggestionItem
          key={'cmd_' + i}
          suggestion={s}
          active={active === i}
        />
      ))}
    </>
  );
};

export default Suggestions;
