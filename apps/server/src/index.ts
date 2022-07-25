/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { dotenvConfig, logger } from '@dusk/utils';
import { PublicKey } from '@solana/web3.js';
import { createConnection } from './config/mongoose';
import { onProgramAccountChange } from './events/onProgramAccountChange';
import { executeTasks } from './tasks';

dotenvConfig();

const waitMongoDB = () =>
  createConnection(process.env.MONGO_DB_URI!).catch(() => {
    logger.error('Error to connect DB');
    process.exit(1);
  });

waitMongoDB()
  .then(() => {
    logger.info('MongoDB connected \n');

    logger.info('Listening onProgramAccountChange');
    onProgramAccountChange(new PublicKey(process.env.PROGRAM_ID!));

    logger.info('Starting tasks');
    executeTasks();
  })
  .catch(logger.error);
