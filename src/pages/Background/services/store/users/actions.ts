import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { updateFooter } from '../footer/actions';
import { RootState } from '../reducers';
import {
  User,
  ADD_USER,
  UserActionTypes,
  SET_DEFAULT_AUTH_USER,
} from './types';

export function addUser(user: User): UserActionTypes {
  return {
    type: ADD_USER,
    payload: user,
  };
}

export function setDefaultAuthUser(
  id: string
): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch: any) => {
    dispatch({
      type: SET_DEFAULT_AUTH_USER,
      id,
    });

    dispatch(updateFooter(`Default set to ${id}`, true));
  };
}
