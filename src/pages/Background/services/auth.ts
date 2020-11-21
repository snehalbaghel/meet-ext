import { extractAccessToken } from '../util';
import { browser } from 'webextension-polyfill-ts';
import { getPrimaryEmail, getUsersContacts, makeMeeting } from './gapi';
// @ts-ignore
import secrets from 'secrets';

const REDIRECT_URL = browser.identity.getRedirectURL();
const CLIENT_ID = secrets.googleApiClientId;
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/contacts.other.readonly',
];
const AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth\
?client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&prompt=select_account\
&scope=${encodeURIComponent(SCOPES.join(' '))}`;
const VALIDATION_BASE_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

/**
Validate the token contained in redirectURL.
- make a GET request to the validation URL, including the access token
- if the response is 200, and contains an "aud" property, and that property
matches the clientID, then the response is valid
- otherwise it is not valid
*/
async function validate(redirectURL: string) {
  const accessToken = extractAccessToken(redirectURL);
  if (!accessToken) {
    throw 'Authorization failure';
  }

  console.log({ accessToken });

  const validationURL = `${VALIDATION_BASE_URL}?access_token=${accessToken}`;
  const validationRequest = new Request(validationURL, {
    method: 'GET',
  });

  const validationResponse = await fetch(validationRequest);

  if (validationResponse.status !== 200) {
    throw 'Token validation error';
  }

  await getPrimaryEmail(accessToken);

  const json = await validationResponse.json();
  if (json.aud && json.aud === CLIENT_ID) {
    return accessToken;
  }

  throw 'Token validation error';
}

/**
Authenticate and authorize using browser.identity.launchWebAuthFlow().
If successful, this resolves with a redirectURL string that contains
an access token.
*/
export async function authorize() {
  const redirectURL = await browser.identity.launchWebAuthFlow({
    interactive: true,
    url: AUTH_URL,
  });

  try {
    const token = await validate(redirectURL);
    const email = await getPrimaryEmail(token);

    return { email, token };
  } catch (error) {
    console.error({ error });
  }
}
