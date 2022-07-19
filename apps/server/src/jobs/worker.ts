import { Job, Worker } from 'bullmq';

// todo: add type
const worker = <T>(workerName: string, cb: (job: Job<T>) => void) =>
  new Worker<T>(
    workerName,
    // eslint-disable-next-line @typescript-eslint/require-await
    async (job) => cb(job),
    {
      connection: {
        host: 'localhost',
        port: 6379,
        // password: 'ac57347f931f4bf9bbd36601ce277a0c',
      },
    }
  );

export default worker;
