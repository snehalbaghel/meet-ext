import { Meta } from '.';

/**
 * Is the char a digit
 */
export function isDigit(c: string) {
  if (c >= '0' && c <= '9') {
    return true;
  }

  return false;
}

/**
 * Get a list of metas from a list of partial metas
 */
export const getMetas: (
  metas: Partial<Meta>[],
  defaults: Partial<Meta>
) => Meta[] = (metas, defaults) => {
  return metas.map((m) => {
    if (m.name) {
      return {
        ...defaults,
        name: m.name || '',
        description: m.description || m.name,
        entity: m.entity || m.name,
        icon: m.icon || m.name + '.png',
      };
    } else {
      throw new Error('Name not defined');
    }
  });
};

/**
 * Use this if you dont care anymore
 */
export const dummyMeta: Meta = {
  description: 'Dummy',
  entity: 'dummy',
  icon: 'dummy',
  name: 'dummy',
};
