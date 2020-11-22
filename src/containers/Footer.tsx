import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../pages/Background/services/store/reducers';
import { FooterState } from '../pages/Background/services/store/footer/types';
import styled from 'styled-components';
import Alert from '@material-ui/lab/Alert';

const FooterContainer = styled.span`
  margin: 8px;
`;

const StyledAlert = styled(Alert)`
  padding: 0px 8px !important;
  background-color: #f2f5f9 !important;
  color: rgb(13, 60, 97) !important;
`;

const Footer: React.FC = () => {
  const { text, success } = useSelector<RootState, FooterState>(
    (state) => state.footer
  );

  return (
    <FooterContainer>
      <StyledAlert severity={success ? 'info' : 'error'}>{text}</StyledAlert>
    </FooterContainer>
  );
};

export default Footer;
