import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { UPDATE_FOOTER, RESET_FOOTER } from './types';

export function updateFooter(
  text: string,
  success: boolean
): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch: any) => {
    dispatch({
      type: UPDATE_FOOTER,
      text,
      success,
    });

    // TODO: Clear timeout somehow
    setTimeout(() => {
      dispatch({ type: RESET_FOOTER });
    }, 10000);
  };
}
