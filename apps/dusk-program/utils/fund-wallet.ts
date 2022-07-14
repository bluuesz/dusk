import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export const fundWallet = async (
  connection: Connection,
  wallet: PublicKey,
  amount: number
) => {
  try {
    const airdropSignature = await connection.requestAirdrop(
      wallet,
      amount * LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
