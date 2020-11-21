import { authorize } from '../auth';

function loginUser() {
  return async (dispatch: any) => {
    // TODO:
    const token = await authorize();
  };
}

export default {
  LOGIN_USER: loginUser,
};
