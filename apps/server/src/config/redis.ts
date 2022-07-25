import Redis from 'ioredis';

// change to .env
const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

export { redis };
