import path from 'path';
import dotenvSafe from 'dotenv-safe';

// Load environment configuration
dotenvSafe.config({
  path: path.resolve(__dirname, '..', '..', '..', '..', '.env'),
  example: path.resolve(__dirname, '..', '..', '..', '..', '.env.example'),
});
