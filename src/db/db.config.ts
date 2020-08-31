import environments from './db.environments';
import { DbConfig } from './db.environments';
const environment: string = process.env.NODE_ENV || 'development';

const environmentConfig: DbConfig = environments[environment];

export default environmentConfig;
