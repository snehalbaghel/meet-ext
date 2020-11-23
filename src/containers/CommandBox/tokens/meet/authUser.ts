import { Meta } from '..';
import TokenGroup from '../../Editor/TokenGroup';
import store from '../../../../pages/Background/services/store';
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

    const metas: Meta[] = matches.map((user_id) => ({
      name: user_id,
      description: usersDict[user_id].name,
      entity: 'auth',
      icon: usersDict[user_id].img,
    }));

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

export const userValueTG = new TokenGroup({
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
  next: [userValueTG],
});
