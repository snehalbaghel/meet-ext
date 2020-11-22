import React from 'react';
import HistorySuggestionItem from './history';
import CommandSuggestionItem from './command';

const Suggestions: React.FC = () => {
  const mock = Array.from(Array(40).keys());

  return (
    <>
      {mock.map((i) => (
        <HistorySuggestionItem />
      ))}
    </>
  );
};

export default Suggestions;
