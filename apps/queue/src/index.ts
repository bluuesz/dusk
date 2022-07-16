import { dotenvConfig } from '@dusk/utils';
import { PublicKey } from '@solana/web3.js';
import { onProgramAccountChange } from './subscriptions/onProgramAccountChange';

const main = () => {
  dotenvConfig();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const programId = new PublicKey(process.env.PROGRAM_ID!);

  // eslint-disable-next-line no-console
  console.log('\nstart listen onProgramAccountChange...');
  onProgramAccountChange(programId);
};

main();
