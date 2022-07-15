import path from 'path';
import dotenvSafe from 'dotenv-safe';

// Load environment configuration
const dotenvConfig = () =>
  dotenvSafe.config({
    path: path.resolve(__dirname, '..', '..', '..', '..', '.env'),
    example: path.resolve(__dirname, '..', '..', '..', '..', '.env.example'),
  });

export { dotenvConfig };
