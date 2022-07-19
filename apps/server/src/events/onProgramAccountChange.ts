/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { PublicKey, Keypair } from '@solana/web3.js';
import { getProgram } from '@dusk/utils';
import { bullmq } from '../jobs';
import { connection } from '../config/connection';
import { DuskProgram, IDL } from '../idl/types/dusk_program';

export const onProgramAccountChange = (programId: PublicKey) => {
  const leakedKp = Keypair.fromSecretKey(
    Uint8Array.from([
      6, 130, 19, 145, 1, 52, 25, 33, 178, 237, 62, 218, 191, 120, 101, 209, 61,
      158, 133, 229, 218, 114, 23, 159, 180, 121, 242, 117, 21, 252, 0, 75, 24,
      213, 142, 26, 38, 97, 117, 174, 84, 180, 40, 45, 206, 3, 120, 21, 0, 149,
      191, 142, 94, 198, 234, 57, 144, 179, 190, 32, 239, 163, 188, 77,
    ])
  );

  const nodeWallet = new NodeWallet(leakedKp);

  const program = getProgram<DuskProgram>(
    IDL,
    programId,
    connection,
    nodeWallet
  );

  const job = bullmq('Donate');

  connection.onProgramAccountChange(programId, (account) => {
    const {
      user: userAddress,
      amount,
      timestamps,
      streamerAddress,
      message,
    } = program.coder.accounts.decode('donate', account.accountInfo.data);

    // add new donate to queue to be proccessed by workers
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    job.queue().add('new-donate', {
      accountId: account.accountId.toBase58(),
      userAddress,
      amount: amount.toNumber(),
      timestamps: timestamps.toNumber(),
      streamerAddress,
      message,
    });
  });
};
