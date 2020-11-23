import { Meta } from '..';
import TokenGroup from '../../Editor/TokenGroup';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { dummyMeta } from '../util';

/**
 * The time key:value pair
 */

// We'll make 10AM the default
export const defaultTime = parse('10', 'H', new Date());

function parseTime(input: string, _props: Meta) {
  if (!input) {
    return null;
  }
  input = input.trim();

  try {
    if (input.endsWith('.')) {
      input = input.slice(0, -1);
    }

    let parsed = parse(input, 'k', new Date());

    if (isNaN(parsed.getTime())) {
      parsed = parse(input, 'k.m', new Date());
    }

    return parsed;
  } catch (error) {
    console.error({ error });
  }
  return null;
}

function suggestTime(matchStr: string, nodeType?: string) {
  if (nodeType && nodeType !== 'value') {
    return [];
  }

  const parsed = parseTime(matchStr, dummyMeta);

  let description = 'Type value..';

  if (parsed) {
    description = format(parsed, 'hh:mm b');
  }

  return [
    {
      name: matchStr,
      description: description,
      entity: 'time_value',
      icon: 'time.png',
      freeText: true,
    },
  ];
}

/**
 * Create the key value pair
 */

export const timeValueTG = new TokenGroup({
  nodeType: 'value',
  leaf: true,
  match: suggestTime,
  parse: parseTime,
});

export default new TokenGroup({
  nodeType: 'key',
  tokens: [
    {
      name: 'time',
      description: 'Time',
      icon: 'time.png',
      entity: 'time',
    },
  ],
  next: [timeValueTG],
});
