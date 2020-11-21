import React from 'react';
import './Popup.css';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';

const Popup: React.FC = () => {
  useSelector((state) => {
    console.log({ state });
  });

  return (
    <div className="App">
      <Button
        onClick={() => {
          // const something = dispatch({ type: 'LOGIN_USER' });
        }}
      >
        Execute
      </Button>
    </div>
  );
};

export default Popup;
