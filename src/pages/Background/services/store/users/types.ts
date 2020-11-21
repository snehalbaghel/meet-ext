export interface User {
  name: string;
  email: string;
  img: string;
  authCode: string;
}

export interface UsersState {
  [id: string]: User;
}

/**
 * Action types
 */

export const ADD_USER = 'ADD_USER';
export const DELETE_USER = 'DELETE_USER';
export const REFRESH_USER = 'REFRESH_USER';

interface AddUserAction {
  type: typeof ADD_USER;
  payload: User;
}

interface DeleteUserAction {
  type: typeof DELETE_USER;
  id: string;
}

interface RefreshUserAction {
  type: typeof REFRESH_USER;
  id: string;
}

export type UserActionTypes =
  | AddUserAction
  | DeleteUserAction
  | RefreshUserAction;
