import { extractTokens } from '../util';
import { browser } from 'webextension-polyfill-ts';
import { v4 as uuid } from 'uuid';
import jwt_decode from 'jwt-decode';
import { getUsersContacts, makeMeeting } from './gapi';
// @ts-ignore
import secrets from 'secrets';

const REDIRECT_URL = browser.identity.getRedirectURL();
const CLIENT_ID = secrets.googleApiClientId;
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/calendar',
];
const AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth\
?client_id=${CLIENT_ID}\
&response_type=id_token+token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&nonce=${uuid()}\
&scope=${encodeURIComponent(SCOPES.join(' '))}`;
const VALIDATION_BASE_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

interface JWTBody {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  nonce: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
  jti: string;
}

/**
Validate the token contained in redirectURL.
- make a GET request to the validation URL, including the access token
- if the response is 200, and contains an "aud" property, and that property
matches the clientID, then the response is valid
- otherwise it is not valid
*/
async function validate(redirectURL: string) {
  const tokens = extractTokens(redirectURL);

  if (!tokens) {
    throw 'Authorization failure';
  }

  const { accessToken, idToken } = tokens;

  const validationURL = `${VALIDATION_BASE_URL}?access_token=${accessToken}`;
  const validationRequest = new Request(validationURL, {
    method: 'GET',
  });

  const validationResponse = await fetch(validationRequest);

  if (validationResponse.status !== 200) {
    throw 'Token validation error';
  }

  const json = await validationResponse.json();
  if (json.aud && json.aud === CLIENT_ID && idToken) {
    const user = jwt_decode(idToken) as JWTBody;
    return { accessToken, user, idToken };
  }

  throw 'Token validation error';
}

/**
Authenticate and authorize using browser.identity.launchWebAuthFlow().
If successful, this resolves with a redirectURL string that contains
an access token.
*/
export async function authorize(prompt?: boolean) {
  let authUrl = AUTH_URL;

  if (prompt) {
    authUrl += '&prompt=select_account';
  }

  const redirectURL = await browser.identity.launchWebAuthFlow({
    interactive: true,
    url: authUrl,
  });

  try {
    const user = await validate(redirectURL);
    return user;
  } catch (error) {
    console.error({ error });
  }
}
