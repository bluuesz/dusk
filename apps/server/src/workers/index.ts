/* eslint-disable @typescript-eslint/no-unused-expressions */
import { logger } from '@dusk/utils';
import { startWorkerDonate } from './donate';

const startWorkers = () => {
  logger.info('Starting worker for new donates');
  startWorkerDonate();
};

startWorkers();
