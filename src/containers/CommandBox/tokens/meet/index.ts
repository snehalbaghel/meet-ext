import { Meta } from '..';
import TokenGroup from '../../Editor/TokenGroup';
import TimeTG from './time';
import DurationTG from './duration';
import DateTG from './date';

const meetMeta: Meta = {
  name: 'meet',
  description: 'Google Meet',
  entity: 'meet',
  icon: 'meet.png',
};

const meetTG = new TokenGroup({
  nodeType: 'root', // more like groupType
  leaf: false,
  tokens: [meetMeta], // Tokens in this group
  next: [TimeTG, DurationTG, DateTG],
});

export default meetTG;
