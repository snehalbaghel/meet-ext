import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ParsedCommand } from '../../../../containers/CommandBox/types';
import { authorize } from '../auth';
import { updateFooter } from './footer/actions';
import { RootState } from './reducers';
import { addUser } from './users/actions';
import { User } from './users/types';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import setDate from 'date-fns/set';
import { add } from 'date-fns';
import { makeMeeting } from '../gapiHelper';

export const LOGIN_USER = 'LOGIN_USER';
export const CREATE_MEETING = 'CREATE_MEETING';

/**
 * Use alias to do tasks in the background script
 */

function loginUser({
  prompt,
  loginHint,
}: {
  prompt: boolean;
  loginHint: string;
}) {
  return async (dispatch: any) => {
    const token = await authorize(prompt, loginHint);

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

function createMeeting({
  parsed,
  rawText,
}: {
  parsed: ParsedCommand;
  rawText: string;
}): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch, getState) => {
    console.log(parsed, rawText);
    const { keyVals } = parsed;
    const entities: { [key: string]: any[] } = {};

    keyVals.forEach((kv) => {
      entities[kv.entity] = kv.val;
    });

    // default: today
    let startDateTime = new Date();
    let endDateTime = new Date(startDateTime);
    let attendees: { email: string }[] = [];
    let title = 'Created by meet-ext';

    // Merge all date entities
    if (entities['date'] && entities['date'].length) {
      startDateTime = new Date(entities['date'][0]);
      endDateTime = new Date(startDateTime);
    }

    const timeEntity = entities['time'];
    if (timeEntity && timeEntity.length) {
      const timeDate = new Date(timeEntity[0]);

      startDateTime = setDate(startDateTime, {
        hours: getHours(timeDate),
        minutes: getMinutes(timeDate),
      });
      endDateTime = new Date(startDateTime);
    }

    const durationEntity = entities['duration'];
    if (durationEntity && durationEntity.length) {
      endDateTime = add(endDateTime, { minutes: durationEntity[0] });
    }

    const emailEntity = entities['email'];
    if (emailEntity && emailEntity.length) {
      emailEntity.forEach((val) => {
        attendees.push({ email: val });
      });
    }

    title = rawText.replace(/[:,]/g, '').trim();

    let { users } = getState();
    let allUsers = users.users;

    // If no user has logged in then open a login window
    // TODO: Check for expired tokens
    if (Object.keys(allUsers).length === 0) {
      await dispatch(loginUser({ prompt: false, loginHint: '' }));
      users = getState().users;
      allUsers = users.users;
    }

    const tokenToUse = allUsers[users.default_id].accessToken;

    const response = await makeMeeting(
      startDateTime,
      endDateTime,
      attendees,
      title,
      tokenToUse
    );

    if (response.status === 200) {
      dispatch(updateFooter('Created and shared event!', true));
    } else {
      dispatch(updateFooter('Something went wrong.', false));
    }
  };
}

export default {
  LOGIN_USER: loginUser,
  CREATE_MEETING: createMeeting,
};
