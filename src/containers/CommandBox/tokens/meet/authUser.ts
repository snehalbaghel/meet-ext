import { Meta } from '..';
import TokenGroup from '../../Editor/TokenGroup';
import store from '../../../../pages/Background/services/store';
import { DEFAULT_USER_ID_KEY } from '../../../../pages/Background/services/store/users/reducer';

// store.subscribe(matchAuthUser);

/**
 * Create the key value pair
 */

function matchAuthUser(matchStr: string, nodeType?: string): Meta[] {
  let { users } = store.getState();
  const usersDict = users.users;

  if (usersDict) {
    const matches = Object.keys(usersDict).filter((id) =>
      id.startsWith(matchStr)
    );

    const metas: Meta[] = matches.map((user_id) => {
      let description = usersDict[user_id].name;
      if (user_id === localStorage.getItem(DEFAULT_USER_ID_KEY)) {
        description += ' (Default)';
      }

      return {
        name: user_id,
        description,
        entity: 'auth',
        icon: usersDict[user_id].img,
      };
    });

    return metas;
  }

  return [
    {
      description: 'Auth User',
      entity: 'auth',
      icon: 'auth.png',
      name: matchStr,
      freeText: true,
    },
  ];
}

export const authUserValueTG = new TokenGroup({
  nodeType: 'value',
  leaf: true,
  match: matchAuthUser,
});

export default new TokenGroup({
  nodeType: 'key',
  tokens: [
    {
      name: 'auth',
      description: 'Auth User',
      icon: 'auth.png',
      entity: 'auth',
    },
  ],
  next: [authUserValueTG],
});
