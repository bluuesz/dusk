import { Queue, QueueEvents } from 'bullmq';
import { logger } from '@dusk/utils';

const bullmq = (queueName: string) => {
  const queue = () =>
    new Queue(queueName, {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });

  const listenQueue = () => {
    const donateQueueEvents = new QueueEvents(queueName, {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });

    donateQueueEvents.on('completed', ({ jobId }) => {
      logger.info(`${jobId} has completed and returned `);
    });

    donateQueueEvents.on('waiting', ({ jobId }) => {
      logger.info(`A job with ID ${jobId} is waiting`);
    });

    donateQueueEvents.on('failed', ({ jobId, failedReason }) => {
      logger.error(`${jobId} has failed with reason ${failedReason}`);
    });
  };

  return { queue, listenQueue };
};

export default bullmq;
