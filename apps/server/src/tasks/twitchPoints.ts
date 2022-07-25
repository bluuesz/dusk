import { logger } from '@dusk/utils';
import { CronJob } from 'cron';
import { findStreamerLoyaltyConfigBySolanaAddress } from '../models/Loyalty';
import { findStreamers } from '../models/User';
import {
  findUserPointsFromStreamer,
  updatePoints,
  create as insertPoints,
} from '../models/Points';
import { Chatters, getChatters } from '../services/twitch/getChatters';
import { getStreamersOnline } from '../services/twitch/getStreamersOnline';

// every minute
const CRON = '* * * * *';

interface ChattersData {
  streamer: string;
  pointsPerMinutes: number;
  solanaAddress: string;
  chatters: Chatters;
  chattersCount: number;
}

const pullAndUpdatePoints = async () => {
  const streamers = await findStreamers();

  const streamersUsernames = streamers.map((streamer) => streamer.username);

  const getStreamersInLive = await getStreamersOnline(streamersUsernames);

  if (getStreamersOnline.length === 0) {
    logger.info('No streamers online');
    return;
  }

  const streamersOnline = streamers.filter(
    (streamer) =>
      !!getStreamersInLive.find(
        (streamerInLive) => streamer.username === streamerInLive.username
      )
  );

  const chatters: ChattersData[] = await Promise.all(
    streamersOnline.map(async (streamer) => {
      const fetchChatters = await getChatters(streamer.username);

      const loyaltyConfig = await findStreamerLoyaltyConfigBySolanaAddress(
        streamer.username
      );

      return {
        streamer: streamer.username,
        pointsPerMinutes: loyaltyConfig ? loyaltyConfig.pointsPerMinute : 10, // default
        solanaAddress: streamer.solanaAddress,
        chatters: fetchChatters.chatters,
        chattersCount: fetchChatters.chatter_count,
      };
    })
  );

  const increasePoints = (chat: ChattersData) =>
    chat.chatters.viewers.map(async (user) => {
      const userPoints = await findUserPointsFromStreamer(user, chat.streamer);

      if (!userPoints) {
        await insertPoints({ user, streamer: chat.streamer, points: 0 });
      }

      await updatePoints(user, chat.streamer, chat.pointsPerMinutes);
    });

  await Promise.all(chatters.map(increasePoints));
};

export const runTwitchPoints = () => {
  const job = new CronJob(
    CRON,
    () => pullAndUpdatePoints,
    null,
    true,
    'America/Sao_Paulo'
  );
  logger.info('Starting twitchPoints');

  job.start();
};
