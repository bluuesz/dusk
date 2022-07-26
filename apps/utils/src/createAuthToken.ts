import { PublicKey } from '@solana/web3.js';
import b58 from 'bs58';

type MessageSigner = {
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  publicKey: PublicKey;
};

const createAuthToken = async (wallet: MessageSigner) => {
  const encodedMessage = new TextEncoder().encode(
    JSON.stringify({
      exp: (new Date().getTime() + 1440 * 60000) / 1000,
    })
  );

  const signature = await wallet.signMessage(encodedMessage);
  const pubkey = wallet.publicKey.toBase58();

  const msg = b58.encode(encodedMessage);
  const sig = b58.encode(signature);

  return `${pubkey}.${msg}.${sig}`;
};

export { createAuthToken };
