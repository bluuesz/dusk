import { connect } from 'mongoose';

const createConnection = (uri: string) => connect(uri);

export { createConnection };
