import TokenGroup from '../Editor/TokenGroup';
import MeetTG from './meet';
import { authUserValueTG } from './meet/authUser';
/**
 * Just nested TokenGroups that are linked to each other
 * (See meet folder)
 */

export interface Meta {
  name: string;
  entity: string;
  description: string;
  icon: string;
  freeText?: boolean;
}

const loginMeta: Meta = {
  name: 'login',
  description: 'Google Login',
  entity: 'login',
  icon: 'login.png',
};

const LoginTG = new TokenGroup({
  nodeType: 'root',
  leaf: true,
  tokens: [loginMeta],
});

const setDefaultMeta: Meta = {
  name: 'setdefault',
  description: 'Set the default auth user',
  entity: 'setdefault',
  icon: 'auth.png',
};

const SetDefaultTG = new TokenGroup({
  nodeType: 'root',
  tokens: [setDefaultMeta],
  next: [authUserValueTG],
});

const RootTokenGroups: TokenGroup[] = [MeetTG, LoginTG, SetDefaultTG];

export default RootTokenGroups;
