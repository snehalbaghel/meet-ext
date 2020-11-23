import { ParsedCommand } from '../../containers/CommandBox/types';
import {
  LOGIN_USER,
  CREATE_MEETING,
} from '../Background/services/store/aliases';

export function loginUser(prompt: boolean, loginHint: string) {
  return { type: LOGIN_USER, prompt, loginHint };
}

export function createMeeting(parsed: ParsedCommand, rawText: string) {
  return { type: CREATE_MEETING, parsed, rawText };
}
