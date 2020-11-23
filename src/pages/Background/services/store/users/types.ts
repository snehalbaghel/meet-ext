export interface User {
  name: string;
  email: string;
  img: string;
  accessToken: string;
  idToken: string;
  updatedAt: string;
}

export interface UsersState {
  default_id: string;
  users: { [id: string]: User };
}

/**
 * Action types
 */

export const ADD_USER = 'ADD_USER';
export const DELETE_USER = 'DELETE_USER';
export const SET_DEFAULT_AUTH_USER = 'SET_DEFAULT_AUTH_USER';

interface AddUserAction {
  type: typeof ADD_USER;
  payload: User;
}

// TODO
interface DeleteUserAction {
  type: typeof DELETE_USER;
  id: string;
}

interface SetDefaultUserAction {
  type: typeof SET_DEFAULT_AUTH_USER;
  id: string;
}

export type UserActionTypes =
  | AddUserAction
  | DeleteUserAction
  | SetDefaultUserAction;
