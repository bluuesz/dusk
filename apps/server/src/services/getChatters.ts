import { request } from '@dusk/utils';

interface Chatters {
  chatter_count: number;
  chatters: {
    broadcaster: string[];

    viewers: string[];
  };
}

export const getChatters = (username: string) =>
  request<Chatters>(`http://tmi.twitch.tv/group/user/${username}/chatters`);
