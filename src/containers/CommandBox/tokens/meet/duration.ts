import { Meta } from '..';
import TokenGroup from '../../Editor/TokenGroup';
import formatDuration from 'date-fns/formatDuration';
import { dummyMeta } from '../util';

/**
 * The duration key:value pair
 */

// We'll make 30 minuts the default
export const defaultDuration = 30;

function parseDuration(input: string, _props: Meta) {
  if (!input) {
    return null;
  }

  try {
    return parseInt(input);
  } catch (error) {
    console.error({ error });
    return null;
  }
}

function suggestDuration(matchStr: string, nodeType?: string) {
  if (nodeType && nodeType !== 'value') {
    return [];
  }

  let description = 'Type value..';
  const parsed = parseDuration(matchStr, dummyMeta);

  if (parsed) {
    description = formatDuration({ minutes: parsed });
  }

  return [
    {
      name: matchStr,
      description: description,
      icon: 'duration.png',
      entity: 'duration_value',
      freeText: true,
    },
  ];
}

/**
 * Create the key value pair
 */

export const durationValueTG = new TokenGroup({
  nodeType: 'value',
  leaf: true,
  match: suggestDuration,
  parse: parseDuration,
});

export default new TokenGroup({
  nodeType: 'key',
  tokens: [
    {
      name: 'dura',
      description: 'Duration',
      icon: 'duration.png',
      entity: 'duration',
    },
  ],
  next: [durationValueTG],
});
