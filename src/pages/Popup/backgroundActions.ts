import { ParsedCommand } from '../../containers/CommandBox/types';
import {
  LOGIN_USER,
  CREATE_MEETING,
} from '../Background/services/store/aliases';

export function loginUser() {
  return { type: LOGIN_USER };
}

export function createMeeting(parsed: ParsedCommand, rawText: string) {
  return { type: CREATE_MEETING, parsed, rawText };
}
