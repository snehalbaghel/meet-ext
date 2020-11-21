import { ADD_USER, UserActionTypes, UsersState } from './types';

const intialState: UsersState = {};

export function usersReducer(
  state = intialState,
  action: UserActionTypes
): UsersState {
  switch (action.type) {
    case ADD_USER:
      return {
        ...state,
        id: action.payload,
      };
    default:
      return state;
  }
}
