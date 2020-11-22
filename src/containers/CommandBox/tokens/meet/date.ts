import parse from 'date-fns/parse';
import add from 'date-fns/add';
import format from 'date-fns/format';
import { Meta } from '..';
import TokenGroup from '../../Editor/TokenGroup';
import { dummyMeta, getMetas, isDigit } from '../util';

/**
 * The date key:value pair
 */

/**
 *  Convert input to a date object
 */
function parseDate(input: string, _props: Meta) {
  if (!input) {
    return null;
  }

  try {
    // 1jan
    if (isDigit(input[0])) {
      return parse(input, 'dMMM', new Date());
    }

    // today, tomorrow, dayafter
    if (input === 'today') {
      return new Date();
    } else if (input === 'tomorrow') {
      return add(new Date(), { days: 1 });
    } else if (input === 'dayafter') {
      return add(new Date(), { days: 2 });
    }
    // TODO: weekday
  } catch (error) {
    console.error({ error });
  }
  return null;
}

const defaults = { icon: 'date.png', entity: 'date_value', freeText: true };

const dateSuggestions: Meta[] = getMetas(
  [
    {
      name: 'tomorrow',
      description: 'Tomorrow',
    },
    {
      name: 'dayafter',
      description: 'Day after tomorrow',
    },
    {
      name: 'today',
      description: 'Today',
    },
  ],
  defaults
);

function suggestDate(matchStr: string, nodeType?: string) {
  if (nodeType && nodeType !== 'value') {
    return [];
  }

  const parsed = parseDate(matchStr, dummyMeta);

  let description = 'invalid! (format: 1mar)';

  if (parsed) {
    description = format(parsed, 'd MMMM');
  }

  if (isDigit(matchStr[0])) {
    // TODO: Should we do default if input is invalid?
    // if (matchStr.length >= 4) {
    // const date = inputToDate(match)
    // }

    return getMetas([{ name: matchStr, description: description }], defaults);
  }

  return dateSuggestions.filter((meta) => {
    return meta.name.toLowerCase().startsWith(matchStr);
  });
}

/**
 * Create the key value pair
 */

export const dateValuesTG = new TokenGroup({
  nodeType: 'value',
  leaf: true,
  parse: parseDate,
  match: suggestDate,
});

export default new TokenGroup({
  nodeType: 'key',
  tokens: [
    {
      name: 'date',
      description: 'Meeting Date (Today)',
      entity: 'date',
      icon: 'date.png',
    },
  ],
  next: [dateValuesTG],
});
