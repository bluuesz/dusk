import './config/env';
import { PublicKey } from '@solana/web3.js';
import { onProgramAccountChange } from './subscriptions/onProgramAccountChange';

const main = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const programId = new PublicKey(process.env.PROGRAM_ID!);

  // eslint-disable-next-line no-console
  console.log('\nstart listen onProgramAccountChange...');
  onProgramAccountChange(programId);
};

main();
