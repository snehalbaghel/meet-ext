import { ADD_USER, UserActionTypes, UsersState } from './types';

const USER_STATE_KEY = 'USER_STATE_KEY';
const DEFAULT_USER_ID_KEY = 'DEFAULT_USER_ID_KEY';

const intialState: UsersState = {
  default_id: localStorage.getItem(DEFAULT_USER_ID_KEY) || '',
  users: JSON.parse(localStorage.getItem(USER_STATE_KEY) || '{}'),
};

export default function usersReducer(
  state = intialState,
  action: UserActionTypes
): UsersState {
  switch (action.type) {
    case ADD_USER:
      const user_id = action.payload.email;
      const newState = {
        default_id: state.default_id || user_id,
        users: {
          ...state.users,
          [user_id]: action.payload,
        },
      };

      localStorage.setItem(USER_STATE_KEY, JSON.stringify(newState.users));
      localStorage.setItem(DEFAULT_USER_ID_KEY, newState.default_id);

      return newState;
    default:
      return state;
  }
}
