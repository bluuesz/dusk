import { Queue } from 'bullmq';

const bullQueue = () => {
  const queue = new Queue('Donate', {
    connection: {
      host: 'localhost',
      port: 6379,
      // password: 'ac57347f931f4bf9bbd36601ce277a0c',
    },
  });

  return queue;
};

export { bullQueue };
