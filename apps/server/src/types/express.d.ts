declare namespace Express {
  export interface Request {
    user: {
      pubkey: string;
    };
  }
}
