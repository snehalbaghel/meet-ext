import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import CommandBox from '../../containers/CommandBox';
import styled from 'styled-components';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import Suggestions from '../../containers/Suggestions';
import { ParsedCommand, Token } from '../../containers/CommandBox/types';
import { Meta } from '../../containers/CommandBox/tokens';
import { Paper } from '@material-ui/core';
import { loginUser } from './backgroundActions';
import Footer from '../../containers/Footer';
import { createMeeting } from './backgroundActions';
import { updateFooter } from '../Background/services/store/footer/actions';
import { setDefaultAuthUser } from '../Background/services/store/users/actions';

const CommandWrapper = styled(Paper)`
  /* height: 56px; */
  border-radius: 14px;
  padding: 8.3px;
  margin: 8px;
  margin-bottom: 0px;
  font-family: 'Ubuntu Mono', monospace;
  border-color: #018cde !important;
`;

const SubtitleIcon = styled(FlashOnIcon)`
  font-size: 1.15rem;
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
  flex-grow: 1;
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

  // useEffect(() => {
  //   dispatch({ type: 'LOGIN_USER' });
  // }, []);

  const updateSelection = useCallback((i: number) => {
    setActive(i);
    const element = document.getElementById('sugg_item_no_' + i);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const execute = useCallback((parsed: ParsedCommand, textDirty: string) => {
    switch (parsed.cmd) {
      case 'login':
        dispatch(loginUser(true, textDirty.replace(/[:, ]/g, '').trim()));
        break;
      case 'meet':
        dispatch(createMeeting(parsed, textDirty));
        break;
      case 'setdefault':
        const setDefault = parsed.keyVals.find((kv) => kv.key === 'unknown');

        if (setDefault && setDefault.val) {
          dispatch(setDefaultAuthUser(setDefault.val));
        }
        break;
      default:
        dispatch(updateFooter('Invalid command', false));
        break;
    }
    return true;
  }, []);

  return (
    <>
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
        Suggestions
      </Subtitle>
      <SuggestionPanel aria-label="suggestion list">
        <Suggestions suggestions={popper.suggestions} active={active} />
      </SuggestionPanel>
      <Footer />
    </>
  );
};

export default Popup;
