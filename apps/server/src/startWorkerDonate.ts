import { logger } from '@dusk/utils';
import { worker } from './jobs';
import { Donate } from './models/Donate';

interface DonateWorkerData {
  accountId: string;
  accountInfo: Donate;
}

const startWorkerDonate = () =>
  worker<DonateWorkerData>('Donate', (job) =>
    logger.info(JSON.stringify(job.data))
  );

startWorkerDonate();
