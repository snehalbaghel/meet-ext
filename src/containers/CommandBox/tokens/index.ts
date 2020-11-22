import TokenGroup from '../Editor/TokenGroup';
import MeetTG from './meet';
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

const RootTokenGroups: TokenGroup[] = [MeetTG, LoginTG];

export default RootTokenGroups;
