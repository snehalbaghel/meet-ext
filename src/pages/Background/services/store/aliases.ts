import { authorize } from '../auth';
import { updateFooter } from './footer/actions';
import { addUser } from './users/actions';
import { User } from './users/types';

/**
 * Use alias to do tasks in the background script
 */

function loginUser() {
  return async (dispatch: any) => {
    const token = await authorize(true);

    if (!token) {
      dispatch(updateFooter('Unable to login user..', false));
      return;
    }

    const userToAdd: User = {
      accessToken: token.accessToken!,
      email: token.user.email,
      img: token.user.picture,
      idToken: token.idToken,
      name: `${token.user.given_name} ${token.user.family_name}`,
    };

    return dispatch(addUser(userToAdd));
  };
}

export const LOGIN_USER = 'LOGIN_USER';

export default {
  LOGIN_USER: loginUser,
};
