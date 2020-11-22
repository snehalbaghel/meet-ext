import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommandBox from '../../containers/CommandBox';
import styled from 'styled-components';
import HistoryIcon from '@material-ui/icons/History';
import Suggestions from '../../containers/Suggestions';
import { ParsedCommand, Token } from '../../containers/CommandBox/types';
import { Meta } from '../../containers/CommandBox/tokens';
import { Paper } from '@material-ui/core';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
`;

const CommandWrapper = styled(Paper)`
  /* height: 56px; */
  border-radius: 14px;
  padding: 8.3px;
  margin: 8px;
  margin-bottom: 0px;
  font-family: 'Ubuntu Mono', monospace;
`;

const SubtitleIcon = styled(HistoryIcon)`
  font-size: 18px;
  padding: 4px;
`;

const Subtitle = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.greyDarkest};
  display: flex;
  align-items: center;
  margin: 4px 8px;
`;

const SuggestionPanel = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 410px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-corner {
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.greyDarker};
    border-radius: 4px;
  }

  &::-webkit-scrollbar:horizontal {
    height: 2px;
  }
`;

const Popup: React.FC = () => {
  const dispatch = useDispatch();
  // const listRef = useRef(null);

  const [popper, setPopper] = useState<{
    open: boolean;
    suggestions: Token<Meta>[];
    activeIndex: number;
  }>({
    open: false,
    suggestions: [],
    activeIndex: 0,
  });
  const [active, setActive] = useState(0);

  const popup = useCallback(
    (newOpen: boolean, suggestion?: Token<Meta>[], i?: number) => {
      setPopper({
        open: newOpen,
        suggestions: suggestion ? suggestion : [],
        activeIndex: i ? i : 0,
      });
    },
    []
  );

  const updateSelection = useCallback((i: number) => {
    setActive(i);

    // if (listRef.current) {
    // @ts-ignore
    // listRef.current.scrollToItem(i ? i : 0);
    // }
  }, []);

  const execute = useCallback((parsed: ParsedCommand, textDirty: string) => {
    return true;
    // TODO
  }, []);

  useSelector((state) => {
    // console.log({ state });
  });

  return (
    <FlexContainer>
      <CommandWrapper variant="outlined">
        <CommandBox
          aria-label="command box"
          popup={popup}
          execute={execute}
          updateSelection={updateSelection}
        />
      </CommandWrapper>
      <Subtitle aria-label="subtitle">
        <SubtitleIcon fontSize="small" />
        History
      </Subtitle>
      <SuggestionPanel aria-label="suggestion list">
        <Suggestions suggestions={popper.suggestions} active={active} />
      </SuggestionPanel>
    </FlexContainer>
  );
};

export default Popup;
