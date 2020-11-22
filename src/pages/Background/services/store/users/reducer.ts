import { ADD_USER, UserActionTypes, UsersState } from './types';

const intialState: UsersState = {
  default_id: '',
  users: {},
};

export default function usersReducer(
  state = intialState,
  action: UserActionTypes
): UsersState {
  switch (action.type) {
    case ADD_USER:
      let user_id = action.payload.email;

      return {
        default_id: state.default_id || user_id,
        users: {
          ...state.users,
          [user_id]: action.payload,
        },
      };
    default:
      return state;
  }
}
