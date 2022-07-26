import { logger } from '@dusk/utils';
import { worker } from '../jobs';
import { Donate } from '../models/Donate';

interface DonateWorkerData {
  accountId: string;
  accountInfo: Donate;
}

export const startWorkerDonate = () =>
  worker<DonateWorkerData>('Donate', (job) =>
    // send event to frontend and then show the donate
    logger.info(JSON.stringify(job.data))
  );
