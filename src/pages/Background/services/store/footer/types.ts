export interface FooterState {
  text: string;
  success: boolean;
}

/**
 * Action types
 */

export const UPDATE_FOOTER = 'UPDATE_FOOTER';

interface UpdateFooterAction {
  type: typeof UPDATE_FOOTER;
  text: string;
  success: boolean;
}

export type FooterActionTypes = UpdateFooterAction;
