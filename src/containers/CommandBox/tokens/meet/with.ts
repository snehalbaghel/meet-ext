import { Meta } from '..';
import TokenGroup from '../../Editor/TokenGroup';

// function parseEmail(raw: string, _props: Meta) {
//     return raw
// }
function matchEmail(matchStr: string, nodeType?: string): Meta[] {
  return [
    {
      description: 'Email (comma seperated)',
      entity: 'email',
      icon: 'email.png',
      name: matchStr,
      freeText: true,
    },
  ];
}

/**
 * Create the key value pair
 */
export const emailValuesTG = new TokenGroup({
  nodeType: 'value',
  leaf: true,
  match: matchEmail,
});

export default new TokenGroup({
  nodeType: 'key',
  tokens: [
    {
      name: 'with',
      description: 'Meet with..',
      entity: 'email',
      icon: 'email.png',
    },
  ],
  next: [emailValuesTG],
});
