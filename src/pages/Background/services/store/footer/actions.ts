import { UPDATE_FOOTER, FooterActionTypes } from './types';

export function updateFooter(
  text: string,
  success: boolean
): FooterActionTypes {
  return {
    type: UPDATE_FOOTER,
    text,
    success,
  };
}
