/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { URLSearchParams } from 'url';
import { request } from '@dusk/utils';
import { redis } from '../../config/redis';

interface OAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export const getOAuthToken = async () => {
  const memoize = await redis.get('dusk-tw-token');

  if (memoize) return memoize;

  const encodedParams = new URLSearchParams();

  encodedParams.set('client_id', process.env.DUSK_CLIENT_ID_TWITCH!);
  encodedParams.set('client_secret', process.env.DUSCK_CLIENT_SECRET_TWITCH!);
  encodedParams.set('grant_type', 'client_credentials');

  const token = await request<OAuthToken>(
    'https://api.twitch.tv/helix/streams',
    'POST',
    {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    encodedParams
  );

  await redis.set('dusk-tw-token', token.access_token, 'EX', token.expires_in);

  return token.access_token;
};
