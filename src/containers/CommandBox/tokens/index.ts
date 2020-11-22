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

const RootTokenGroups: TokenGroup[] = [MeetTG];

export default RootTokenGroups;
