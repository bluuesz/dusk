import { request } from '@dusk/utils';

export interface Chatters {
  broadcaster: string[];
  viewers: string[];
}
interface ChattersResponse {
  chatter_count: number;
  chatters: Chatters;
}

export const getChatters = (username: string) =>
  request<ChattersResponse>(
    `http://tmi.twitch.tv/group/user/${username}/chatters`
  );
