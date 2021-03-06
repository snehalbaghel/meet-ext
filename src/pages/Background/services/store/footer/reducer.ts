import {
  UPDATE_FOOTER,
  RESET_FOOTER,
  FooterState,
  FooterActionTypes,
} from './types';

const initialState: FooterState = {
  text: 'Use ▲,▼,↩ to use suggestions, mod+/ to execute',
  success: true,
};

export default function footerReducer(
  state = initialState,
  action: FooterActionTypes
): FooterState {
  switch (action.type) {
    case UPDATE_FOOTER:
      return {
        text: action.text,
        success: action.success,
      };
    case RESET_FOOTER:
      return initialState;
    default:
      return state;
  }
}
