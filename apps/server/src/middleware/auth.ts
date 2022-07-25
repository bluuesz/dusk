import { Request, Response, NextFunction } from 'express';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import b58 from 'bs58';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Missing auth header' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, token] = authHeader.split(' ');

  const [pubkey, msg, sig] = token.split('.');

  const isValidSignature = nacl.sign.detached.verify(
    b58.decode(msg),
    b58.decode(sig),
    new PublicKey(pubkey).toBytes()
  );

  if (!isValidSignature) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  const contents = JSON.parse(new TextDecoder().decode(b58.decode(msg))) as {
    exp: number;
  };

  const date = new Date();

  if (Math.round(date.getTime() / 1000) > contents.exp) {
    return res.status(401).send({ error: { message: 'Expired signature' } });
  }

  req.user = {
    pubkey,
  };

  return next();
};
