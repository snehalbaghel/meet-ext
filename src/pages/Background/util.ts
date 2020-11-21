/**
 * Extract access token from oauth redirect
 */
export function extractAccessToken(redirectUri: string) {
  let m = redirectUri.match(/[#?](.*)/);
  if (!m || m.length < 1) return null;
  let params = new URLSearchParams(m[1].split('#')[0]);
  return params.get('access_token');
}

/**
 * Get user info from google api.
 */
export async function getUserInfo(accessToken: string) {
  const requestURL = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
  const requestHeaders = new Headers();
  requestHeaders.append('Authorization', 'Bearer ' + accessToken);
  const userInfoRequest = new Request(requestURL, {
    method: 'GET',
    headers: requestHeaders,
  });

  const response = await fetch(userInfoRequest);

  if (response.status === 200) {
    return response.json();
  } else {
    throw response.status;
  }
}

/**
 * Convert date to rfc3339 format
 */
export function toRFC3339Format(d: Date) {
  function pad(n: number) {
    return n < 10 ? '0' + n : n;
  }
  return (
    d.getUTCFullYear() +
    '-' +
    pad(d.getUTCMonth() + 1) +
    '-' +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    ':' +
    pad(d.getUTCMinutes()) +
    ':' +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}
