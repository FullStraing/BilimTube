import { randomBytes } from 'crypto';

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
};

type GoogleUserInfoResponse = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
};

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

function getRequiredEnv(name: 'GOOGLE_CLIENT_ID' | 'GOOGLE_CLIENT_SECRET') {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function createGoogleOauthState() {
  return randomBytes(24).toString('hex');
}

export function resolveAppBaseUrl(req: Request) {
  if (process.env.APP_URL) return process.env.APP_URL;
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export function getGoogleRedirectUri(req: Request) {
  return process.env.GOOGLE_REDIRECT_URI ?? `${resolveAppBaseUrl(req)}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(req: Request, state: string) {
  const clientId = getRequiredEnv('GOOGLE_CLIENT_ID');
  const redirectUri = getGoogleRedirectUri(req);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    include_granted_scopes: 'true',
    prompt: 'select_account'
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeGoogleCode(req: Request, code: string) {
  const clientId = getRequiredEnv('GOOGLE_CLIENT_ID');
  const clientSecret = getRequiredEnv('GOOGLE_CLIENT_SECRET');
  const redirectUri = getGoogleRedirectUri(req);

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Google code');
  }

  return (await response.json()) as GoogleTokenResponse;
}

export async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Google user profile');
  }

  return (await response.json()) as GoogleUserInfoResponse;
}

