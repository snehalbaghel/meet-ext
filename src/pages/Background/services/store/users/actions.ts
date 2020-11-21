import { User, ADD_USER, UserActionTypes } from './types';

export function addUser(user: User): UserActionTypes {
  return {
    type: ADD_USER,
    payload: user,
  };
}
