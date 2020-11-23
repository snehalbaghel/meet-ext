export interface FooterState {
  text: string;
  success: boolean;
}

/**
 * Action types
 */

export const UPDATE_FOOTER = 'UPDATE_FOOTER';
export const RESET_FOOTER = 'RESET_FOOTER';

interface UpdateFooterAction {
  type: typeof UPDATE_FOOTER;
  text: string;
  success: boolean;
}

interface ResetFooterAction {
  type: typeof RESET_FOOTER;
}

export type FooterActionTypes = UpdateFooterAction | ResetFooterAction;
