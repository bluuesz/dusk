import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

export const getProgram = <T extends anchor.Idl>(
  idl: anchor.Idl,
  programId: PublicKey,
  connection: Connection,
  wallet: anchor.Wallet
) => {
  const defaultOptions = anchor.AnchorProvider.defaultOptions();
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    defaultOptions
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const program = new anchor.Program<T>(idl as any, programId, provider);

  return program;
};
