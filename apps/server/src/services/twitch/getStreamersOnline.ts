import { request } from '@dusk/utils';

interface StreamData {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: Date;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

interface Streams {
  data: StreamData[];
}

interface StreamersOnline {
  userId: string;
  username: string;
}

export const getStreamersOnline = async (
  usernames: string[]
): Promise<StreamersOnline[]> => {
  const token = 'x'; // get from redis

  const queryParams = usernames.reduce(
    (acc, username) =>
      acc ? `user_login=${username}&${acc}` : `user_login=${username}`,
    ''
  );

  const streams = await request<Streams>(
    `https://api.twitch.tv/helix/streams?${queryParams}`,
    'GET',
    {
      Authorization: `Bearer ${token}`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      'Client-Id': process.env.DUSK_CLIENT_ID_TWITCH!,
    }
  );

  const streamersOnline = streams.data.map((live) => ({
    userId: live.user_id,
    username: live.user_login,
  }));

  return streamersOnline;
};
