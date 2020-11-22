import { toRFC3339Format } from '../util';
import { v4 as uuid } from 'uuid';

gapi.load('client', loadClient);

function loadClient() {
  gapi.client.load('auth2', 'v1');
  gapi.client.load('calendar', 'v3');
  gapi.client.load('people', 'v1');
}

/**
 * Get authenticated user's contacts
 */
export async function getUsersContacts(token: string) {
  gapi.client.setToken({ access_token: token });

  const resp = await gapi.client.people.otherContacts.list({
    readMask: 'emailAddresses,names',
    // sources: 'DIRECTORY_SOURCE_TYPE_UNSPECIFIED',
  });

  if (resp.status === 200) {
    return resp.result;
  }

  return null;
}

/**
 * Schedule a Google meet conference
 */
export async function makeMeeting(token: string) {
  // https://www.googleapis.com/auth/calendar.events

  gapi.client.setToken({ access_token: token });

  const startTime = new Date();
  const endTime = new Date(startTime);

  endTime.setMinutes(startTime.getMinutes() + 30);

  const resp = await gapi.client.calendar.events.insert({
    calendarId: 'primary',
    sendUpdates: 'all',
    conferenceDataVersion: 1,
    resource: {
      attendees: [{ email: 'snehal@rivi.ai' }],
      summary: 'Created by meet-ext',
      start: {
        dateTime: toRFC3339Format(startTime),
      },
      end: {
        dateTime: toRFC3339Format(endTime),
      },
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: { type: 'hangoutsMeet' },
          requestId: uuid(),
        },
      },
    },
  });

  return resp.result;
}
